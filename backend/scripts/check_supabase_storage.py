"""Comprueba un bucket de Supabase sin imprimir claves ni URLs sensibles."""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

from dotenv import load_dotenv


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", default=".env.supabase")
    args = parser.parse_args()
    load_dotenv(args.env_file, override=True)

    project_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    secret_key = os.environ.get("SUPABASE_SECRET_KEY")
    bucket = os.environ.get("SUPABASE_STORAGE_BUCKET")
    if not all((project_url, secret_key, bucket)):
        print("ERROR: faltan variables de Supabase Storage.", file=sys.stderr)
        return 1

    request = urllib.request.Request(
        f"{project_url}/storage/v1/bucket/{bucket}",
        headers={"apikey": secret_key},
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.load(response)
        print(
            f"Storage OK: bucket={payload.get('name')}, "
            f"publico={payload.get('public')}, "
            f"limite_bytes={payload.get('file_size_limit')}"
        )
        return 0
    except urllib.error.HTTPError as error:
        print(f"ERROR Storage: HTTP {error.code}", file=sys.stderr)
        return 1
    except Exception as error:
        print(f"ERROR Storage: {type(error).__name__}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
