#!/usr/bin/env python3
"""
Batch video generator for "The Last Invitation"
Reads scene_prompts.json and generates one MP4 per scene using Runway Gen-3.

Usage:
    python generate_all_scenes.py
    python generate_all_scenes.py --scenes 1 3 7   # Only specific scenes
    python generate_all_scenes.py --dry-run         # Preview prompts, no API calls
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error

API_BASE = "https://api.dev.runwayml.com/v1"
RUNWAY_VERSION = "2024-11-06"
PROMPTS_FILE = "scene_prompts.json"
OUTPUT_DIR = "video_scenes"


def api_request(method, path, api_key, body=None):
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={
            "Authorization": f"Bearer {api_key}",
            "X-Runway-Version": RUNWAY_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err_text = e.read().decode()
        try:
            err = json.loads(err_text)
            raise RuntimeError(err.get("message", err_text)) from e
        except json.JSONDecodeError:
            raise RuntimeError(err_text) from e


def poll_task(task_id, api_key, timeout=600):
    deadline = time.time() + timeout
    dots = 0
    while time.time() < deadline:
        time.sleep(5)
        result = api_request("GET", f"/tasks/{task_id}", api_key)
        status = result.get("status", "PENDING")
        dots = (dots % 3) + 1
        print(f"\r    Waiting: {status}" + "." * dots + "   ", end="", flush=True)
        if status == "SUCCEEDED":
            print()
            outputs = result.get("output", [])
            if not outputs:
                raise RuntimeError("No output URL in response")
            return outputs[0]
        if status == "FAILED":
            print()
            raise RuntimeError(result.get("failure", "Generation failed"))
    raise RuntimeError("Timed out waiting for video")


def download_file(url, dest):
    print(f"    Saving to {dest} …", end="", flush=True)
    urllib.request.urlretrieve(url, dest)
    size_kb = os.path.getsize(dest) // 1024
    print(f" done ({size_kb} KB)")


def generate_scene(scene, api_key, output_dir):
    scene_num = scene["scene"]
    filename = f"scene_{scene_num:02d}_{scene['title'].lower().replace(' ', '_').replace('-', '_')}.mp4"
    output_path = os.path.join(output_dir, filename)

    if os.path.exists(output_path):
        print(f"  Scene {scene_num}: Already exists, skipping. ({filename})")
        return output_path

    print(f"\n  Scene {scene_num}: {scene['title']}")
    print(f"  Duration: {scene['duration']}s | Ratio: {scene['ratio']}")
    print(f"  Prompt: {scene['prompt'][:80]}…")

    payload = {
        "model": "gen3a_turbo",
        "promptText": scene["prompt"],
        "promptImage": None,
        "negativePrompt": scene.get("negative", ""),
        "duration": scene["duration"],
        "ratio": scene["ratio"],
        "watermark": False,
    }

    result = api_request("POST", "/image_to_video", api_key, payload)
    task_id = result["id"]
    print(f"    Task: {task_id}")

    video_url = poll_task(task_id, api_key)
    download_file(video_url, output_path)
    return output_path


def main():
    parser = argparse.ArgumentParser(description='Generate all scenes for "The Last Invitation"')
    parser.add_argument("--api-key", default=os.environ.get("RUNWAY_API_KEY"))
    parser.add_argument("--scenes", type=int, nargs="+", help="Scene numbers to generate (default: all)")
    parser.add_argument("--dry-run", action="store_true", help="Preview prompts without calling API")
    parser.add_argument("--prompts-file", default=PROMPTS_FILE)
    parser.add_argument("--output-dir", default=OUTPUT_DIR)
    args = parser.parse_args()

    # Load prompts
    if not os.path.exists(args.prompts_file):
        print(f"Error: {args.prompts_file} not found.", file=sys.stderr)
        sys.exit(1)

    with open(args.prompts_file) as f:
        scenes = json.load(f)

    # Filter scenes if requested
    if args.scenes:
        scenes = [s for s in scenes if s["scene"] in args.scenes]
        if not scenes:
            print("No scenes match the given numbers.", file=sys.stderr)
            sys.exit(1)

    print(f'\n"THE LAST INVITATION" - AI Video Generator')
    print(f"{'=' * 50}")
    print(f"Scenes to generate: {len(scenes)}")
    total_seconds = sum(s["duration"] for s in scenes)
    print(f"Total runtime: ~{total_seconds}s ({total_seconds // 60}m {total_seconds % 60}s)")
    print(f"Output folder: {args.output_dir}/")

    if args.dry_run:
        print("\n[DRY RUN] Prompts preview:\n")
        for s in scenes:
            print(f"Scene {s['scene']:02d}: {s['title']}")
            print(f"  Duration: {s['duration']}s | Ratio: {s['ratio']}")
            print(f"  Prompt: {s['prompt'][:120]}…")
            print()
        return

    if not args.api_key:
        print("\nError: Set RUNWAY_API_KEY env var or pass --api-key", file=sys.stderr)
        sys.exit(1)

    os.makedirs(args.output_dir, exist_ok=True)

    completed = []
    failed = []

    for i, scene in enumerate(scenes, 1):
        print(f"\n[{i}/{len(scenes)}]", end="")
        try:
            path = generate_scene(scene, args.api_key, args.output_dir)
            completed.append((scene["scene"], scene["title"], path))
        except Exception as e:
            print(f"\n  ERROR on scene {scene['scene']}: {e}")
            failed.append((scene["scene"], scene["title"], str(e)))
        # Rate limiting pause between scenes
        if i < len(scenes):
            time.sleep(2)

    print(f"\n{'=' * 50}")
    print(f"Done! {len(completed)}/{len(scenes)} scenes generated.\n")

    if completed:
        print("Generated files:")
        for num, title, path in completed:
            print(f"  Scene {num:02d}: {path}")

    if failed:
        print(f"\nFailed scenes:")
        for num, title, err in failed:
            print(f"  Scene {num:02d} ({title}): {err}")

    print(f"\nAll videos saved to: {args.output_dir}/")
    print("Tip: Use a video editor (DaVinci Resolve, iMovie, Premiere) to assemble the scenes.")


if __name__ == "__main__":
    main()
