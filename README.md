# Mahjong Ukeire Trainer

Streamlit app for comparing discard candidates from a 14-tile iishanten hand.
The first version supports normal hands only. Chiitoitsu and kokushi can be
added later as separate shanten strategies.

## Run

```powershell
pip install -r requirements.txt
streamlit run app.py
```

To open from a phone on the same Wi-Fi:

```powershell
streamlit run app.py --server.address 0.0.0.0 --server.port 8501
```

## Input

Both compact and separated notation are supported.

```text
123m456m789p11s&#x6771;&#x5357;&#x4e2d;
1m,2m,3m,4m,5m,6m,7p,8p,9p,1s,1s,&#x6771;,&#x5357;,&#x4e2d;
```

Tiles are represented as `1m` to `9m`, `1p` to `9p`, `1s` to `9s`, and the
seven honor tiles.

## Test

```powershell
pip install -e ".[dev]"
python -m pytest
```

## Deploy

The simplest public deployment target is Streamlit Community Cloud.

1. Create a GitHub repository.
2. Upload this project. Include `app.py`, `requirements.txt`, `README.md`, `.streamlit/`, and the whole `mahjong/` directory.
3. In Streamlit Community Cloud, create a new app from the GitHub repository.
4. Set the main file path to `app.py`.
5. Deploy.

The tile images live in `mahjong/pai_illustration/`, so make sure that directory is committed to GitHub.

The review-mode saved-problem file is written under `data/problems.json`.
On free cloud hosts, files created at runtime may not be permanently preserved
after redeploys or restarts. The built-in chinitsu training questions are code
generated and do not depend on that file.
