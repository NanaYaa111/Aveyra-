#!/usr/bin/env python3
"""
AI Video Generator — Runway Gen-3 Alpha
Usage:
    python generate_video.py "a dog running on the beach at sunset"
    python generate_video.py "timelapse city traffic" --duration 10 --ratio 1280:720
"""

import argparse
import os
import sys
import time
import json
import urllib.request
import urllib.error

API_BASE = "https://api.dev.runwayml.com/v1"
RUNWAY_VERSION = "2024-11-06"


def api_request(method: str, path: str, api_key: str, body: dict | None = None):
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
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
        body_text = e.read().decode()
        try:
            err = json.loads(body_text)
            raise RuntimeError(err.get("message", body_text)) from e
        except json.JSONDecodeError:
            raise RuntimeError(body_text) from e


def poll_task(task_id: str, api_key: str, timeout: int = 600) -> str:
    """Poll until task succeeds; return video URL."""
    deadline = time.time() + timeout
    interval = 5
    dots = 0

    while time.time() < deadline:
        time.sleep(interval)
        result = api_request("GET", f"/tasks/{task_id}", api_key)
        status = result.get("status", "PENDING")

        dots = (dots % 3) + 1
        print(f"\r  Status: {status}" + "." * dots + "   ", end="", flush=True)

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


def download_file(url: str, dest: str) -> None:
    print(f"  Downloading to {dest} …")
    urllib.request.urlretrieve(url, dest)


def main():
    parser = argparse.ArgumentParser(description="Generate AI video with Runway Gen-3")
    parser.add_argument("prompt", help="Text prompt describing the video")
    parser.add_argument("--negative", default="", help="Negative prompt (things to avoid)")
    parser.add_argument("--duration", type=int, choices=[5, 10], default=10, help="Duration in seconds")
    parser.add_argument("--ratio", default="1280:720",
                        choices=["1280:720", "720:1280", "1104:832", "832:1104", "960:960"],
                        help="Video aspect ratio (width:height)")
    parser.add_argument("--output", default="output.mp4", help="Output filename")
    parser.add_argument("--api-key", default=os.environ.get("RUNWAY_API_KEY"), help="Runway API key")
    parser.add_argument("--url-only", action="store_true", help="Print video URL instead of downloading")
    args = parser.parse_args()

    if not args.api_key:
        print("Error: provide --api-key or set RUNWAY_API_KEY env var.", file=sys.stderr)
        sys.exit(1)

    print(f"Prompt : {args.prompt}")
    print(f"Model  : gen3a_turbo  |  Duration: {args.duration}s  |  Ratio: {args.ratio}")
    print()

    print("Submitting task to Runway…")
    payload = {
        "model": "gen3a_turbo",
        "promptText": args.prompt,
        "promptImage": None,
        "duration": args.duration,
        "ratio": args.ratio,
        "watermark": False,
    }
    if args.negative:
        payload["negativePrompt"] = args.negative

    result = api_request("POST", "/image_to_video", args.api_key, payload)
    task_id = result["id"]
    print(f"Task ID: {task_id}")
    print("Waiting for generation", end="")

    video_url = poll_task(task_id, args.api_key)
    print(f"Done!  URL: {video_url}")

    if args.url_only:
        print(video_url)
    else:
        download_file(video_url, args.output)
        print(f"\nSaved: {args.output}")


if __name__ == "__main__":
    main()
