---
title: "SemiAdapt: Semi-Supervised and Efficient LoRA-Based Domain Adaptation for Low-Resource Irish Machine Translation with Transformers"
slug: "semiadapt-lora-domain-adaptation"
date: "2026-05-21"
year: 2026
authors:
  - "Josh McGiff"
  - "Nikola S. Nikolov"
venue: "Proceedings of the Fifteenth Language Resources and Evaluation Conference (LREC 2026)"
type: "conference"
doi: "10.63317/2gfkah2nq6uv"
url: "https://aclanthology.org/2026.lrec-1.801/"
pdfUrl: "https://aclanthology.org/2026.lrec-1.801/"
scholarUrl: "https://scholar.google.com/citations?user=gxxcDz4AAAAJ"
topics:
  - "Digital Immersion for Irish"
  - "Low-Resource NLP"
  - "Irish Tech Ecosystem"
featured: true
abstract: "Fine-tuning is widely used to adapt multilingual Transformer models for machine translation (MT) in specific domains. However, full-parameter fine-tuning of large multilingual models with billions of parameters is computationally expensive, thus creating a barrier to entry for researchers working on low-resource tasks such as Irish translation. Parameter-efficient fine-tuning (PEFT) addresses this by updating a fraction of the original model parameters, with the Low-Rank Adaptation approach (LoRA) introducing small, trainable adapter layers. We introduce SemiAdapt-Full and SemiAdapt-LoRA as semi-supervised approaches that leverage inferred domains to improve overall performance in MT. SemiAdapt-LoRA employs dynamic routing at inference time, eliminating the need to load multiple separately fine-tuned models. Instead, a single shared base model is maintained while lightweight domain-specific adapters, updating only 1.39% of the model parameters in our case, are activated dynamically. We demonstrate that SemiAdapt-Full can outperform full-model fine-tuning and SemiAdapt-LoRA can propel PEFT methods to compete with full-model fine-tuning. We further evaluate corpus-level domain fine-tuning and demonstrate that our embedding-based inference methods perform especially well on larger and noisier corpora. Code and training configurations are released to support reproducibility. Ultimately, our approach narrows the performance gap between PEFT and full-parameter fine-tuning, offering resource-constrained researchers a computationally efficient alternative."
bibtex: |
  @inproceedings{mcgiff-nikolov-2026-semiadapt,
      title = "{S}emi{A}dapt: Semi-Supervised and Efficient {L}o{RA}-Based Domain Adaptation for Low-Resource {I}rish Machine Translation with Transformers",
      author = "Mcgiff, Josh  and
        Nikolov, Nikola S.",
      editor = "Piperidis, Stelios  and
        Bel, N{\'u}ria  and
        van den Heuvel, Henk  and
        Ide, Nancy  and
        Krek, Simon  and
        Toral, Antonio",
      booktitle = "Proceedings of the Fifteenth Language Resources and Evaluation Conference",
      month = may,
      year = "2026",
      address = "Palma de Mallorca, Spain",
      publisher = "ELRA Language Resource Association",
      url = "https://aclanthology.org/2026.lrec-1.801/",
      doi = "10.63317/2gfkah2nq6uv",
      pages = "10208--10220",
      abstract = "Fine-tuning is widely used to adapt multilingual Transformer models for machine translation (MT) in specific domains. However, full-parameter fine-tuning of large multilingual models with billions of parameters is computationally expensive, thus creating a barrier to entry for researchers working on low-resource tasks such as Irish translation. Parameter-efficient fine-tuning (PEFT) addresses this by updating a fraction of the original model parameters, with the Low-Rank Adaptation approach (LoRA) introducing small, trainable adapter layers. We introduce SemiAdapt-Full and SemiAdapt-LoRA as semi-supervised approaches that leverage inferred domains to improve overall performance in MT. SemiAdapt-LoRA employs dynamic routing at inference time, eliminating the need to load multiple separately fine-tuned models. Instead, a single shared base model is maintained while lightweight domain-specific adapters, updating only 1.39{\%} of the model parameters in our case, are activated dynamically. We demonstrate that SemiAdapt-Full can outperform full-model fine-tuning and SemiAdapt-LoRA can propel PEFT methods to compete with full-model fine-tuning. We further evaluate corpus-level domain fine-tuning and demonstrate that our embedding-based inference methods perform especially well on larger and noisier corpora. Code and training configurations are released to support reproducibility. Ultimately, our approach narrows the performance gap between PEFT and full-parameter fine-tuning, offering resource-constrained researchers a computationally efficient alternative."
  }
---

# SemiAdapt: Semi-Supervised and Efficient LoRA-Based Domain Adaptation for Low-Resource Irish Machine Translation with Transformers

## Overview
Fine-tuning is widely used to adapt multilingual Transformer models for machine translation (MT) in specific domains. However, full-parameter fine-tuning of large multilingual models with billions of parameters is computationally expensive, thus creating a barrier to entry for researchers working on low-resource tasks such as Irish translation. Parameter-efficient fine-tuning (PEFT) addresses this by updating a fraction of the original model parameters, with the Low-Rank Adaptation approach (LoRA) introducing small, trainable adapter layers. 

We introduce SemiAdapt-Full and SemiAdapt-LoRA as semi-supervised approaches that leverage inferred domains to improve overall performance in MT. SemiAdapt-LoRA employs dynamic routing at inference time, eliminating the need to load multiple separately fine-tuned models. Instead, a single shared base model is maintained while lightweight domain-specific adapters, updating only 1.39% of the model parameters in our case, are activated dynamically. 

We demonstrate that SemiAdapt-Full can outperform full-model fine-tuning and SemiAdapt-LoRA can propel PEFT methods to compete with full-model fine-tuning. We further evaluate corpus-level domain fine-tuning and demonstrate that our embedding-based inference methods perform especially well on larger and noisier corpora. Code and training configurations are released to support reproducibility. Ultimately, our approach narrows the performance gap between PEFT and full-parameter fine-tuning, offering resource-constrained researchers a computationally efficient alternative.
