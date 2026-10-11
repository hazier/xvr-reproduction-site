# XVR H800 FullSFT: Public Results Browser

Public, curated presentation of the historical July 2026 H800 full-parameter SFT experiment.
This is not the later VaLR/Step1250 experiment, and not the official XVR project.

- All 1,866 XVR-Eval questions, with the matched-protocol Base, Author XVR and H800 FullSFT outputs.
- 6,574 referenced images, displayed as metadata-stripped JPEG derivatives (maximum side 768 pixels, quality 78). These are not the original inference inputs.
- Archived H800 XVR token traces are a separate diagnostic run and never replace the primary scores.
- Results: Base 400/1866 (21.44%), Author 1276/1866 (68.38%), H800 1348/1866 (72.24%).

The page loads `data/cases.json`, per-case JSON and `assets/images/*.jpg` using relative URLs.
No access tokens, Python server, GPU or login are required for the published site.
No model weights, full training data, server credentials or operational logs are published.
The full research archive remains in a separate private repository.

## Local Preview

Run `python -m http.server 8080 --bind 127.0.0.1` in this directory and open http://127.0.0.1:8080.
JSON fetches require an HTTP server; opening index.html through file:// is not supported.

## Provenance

The page includes inline numbered citations and a References section covering the
XVR paper (Jeong et al., CVPR 2026; https://arxiv.org/abs/2603.27967), official
dataset, base model, author model, upstream code and this experiment's own evidence.
Links were checked on 2026-10-11. Upstream references are distinguished from our
measured scores; they do not independently verify the archived 68.06% paper value.

`data/provenance.json` records hashes of the archived result sources.
`data/image-manifest.json` records original image hashes and display derivative hashes.
`data/results-verified.json` records the independently rescored main experiment.
Paper value 68.06% is taken from the archived report, not a newly verified paper table;
the comparison does not establish statistical significance or superiority on every subtask.

Upstream: https://github.com/cross-view-relations/cross-view-relations
Project: https://cross-view-relations.github.io
Base model family: Qwen3-VL. Source code, data and images remain the property of their
respective rights holders; this presentation grants no additional third-party license.
