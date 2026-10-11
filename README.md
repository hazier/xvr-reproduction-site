# XVR H800 FullSFT: Public Results Browser

Public, curated presentation of the historical July 2026 H800 full-parameter SFT experiment.
This is not the later VaLR/Step1250 experiment, and not the official XVR project.

**[Open the public results browser](https://hazier.github.io/xvr-reproduction-site/)**

- All 1,866 XVR-Eval questions from the [XVR dataset](https://huggingface.co/datasets/Jaehwisong/XVR), with the matched-protocol Base, Author XVR and H800 FullSFT outputs.
- 6,574 referenced images, displayed as metadata-stripped JPEG derivatives (maximum side 768 pixels, quality 78). These are not the original inference inputs.
- Archived H800 XVR token traces are a separate diagnostic run and never replace the primary scores.
- Results: Base 400/1866 (21.44%), Author 1276/1866 (68.38%), H800 1348/1866 (72.24%). These are our measured scores, not the paper's table; see the [independent rescoring record](data/results-verified.json).

The page loads `data/cases.json`, per-case JSON and `assets/images/*.jpg` using relative URLs.
No access tokens, Python server, GPU or login are required for the published site.
No model weights, full training data, server credentials or operational logs are published.
The full research archive remains in a separate private repository.

## Local Preview

Run `python -m http.server 8080 --bind 127.0.0.1` in this directory and open http://127.0.0.1:8080.
JSON fetches require an HTTP server; opening index.html through file:// is not supported.

## Provenance

[Result provenance](data/provenance.json) records paths and SHA256 hashes of the
archived result sources, including the separate diagnostic token-trace run.
[Image provenance](data/image-manifest.json) records original image hashes and display derivative hashes.
[Score verification](data/results-verified.json) records the independently rescored main experiment.
Paper value 68.06% is taken from the archived report, not a newly verified paper table;
the comparison does not establish statistical significance or superiority on every subtask.

## References and Experiment Sources

The numbering matches the [website references](https://hazier.github.io/xvr-reproduction-site/#references).

1. Suchae Jeong, Jaehwi Song, et al. *Learning Multi-View Spatial Reasoning from Cross-View Relations.* CVPR, 2026, pp. 2570-2581. [Paper](https://arxiv.org/abs/2603.27967) | [Official project](https://cross-view-relations.github.io/). Source for the XVR method and benchmark, not our measured scores.
2. XVR authors. *XVR dataset.* [Jaehwisong/XVR](https://huggingface.co/datasets/Jaehwisong/XVR). Source of questions, multi-view images and ground-truth answers. This site's resized JPEGs are display derivatives, not inference inputs.
3. Qwen Team. *Qwen3-VL-2B-Instruct.* [Official model card](https://huggingface.co/Qwen/Qwen3-VL-2B-Instruct). Base model and initialization for our FullSFT run.
4. XVR authors. *Qwen3-VL-2B-XVR.* [Author model card](https://huggingface.co/Jaehwisong/Qwen3-VL-2B-XVR). Author checkpoint used in our matched-protocol comparison.
5. XVR authors. *Cross-View-Relations.* [Official code](https://github.com/cross-view-relations/cross-view-relations). Upstream training, data generation and evaluation implementation. Current upstream code is not necessarily identical to the archived version used in this experiment.
6. This project. *H800 FullSFT reproduction records*, July 2026. [Measured results](data/summary.json) | [Rescoring evidence](data/results-verified.json) | [Source paths and hashes](data/provenance.json). Experimental records, not a peer-reviewed paper. The complete research archive remains private.

External links checked on 2026-10-11. These citations attribute the method, data,
models and code; they do not imply endorsement by the upstream authors or a fresh
verification of the archived 68.06% paper value.

### Paper BibTeX

For the original XVR work (not this reproduction), the official project supplies:

```bibtex
@inproceedings{jeong2026learning,
  title={Learning Multi-View Spatial Reasoning from Cross-View Relations},
  author={Jeong, Suchae and Song, Jaehwi and Lee, Haeone and Kim, Hanna and Kim, Jian and Lee, Dongjun and Shin, Dong Kyu and Kim, Changyeon and Hahm, Dongyoon and Jin, Woogyeol and others},
  booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition},
  pages={2570--2581},
  year={2026}
}
```

## Attribution

Source code, data and images remain the property of their
respective rights holders; this presentation grants no additional third-party license.
