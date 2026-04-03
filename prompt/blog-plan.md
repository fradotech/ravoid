# Ravoid Article Plan #29–35 (Revised & Detailed)

**Tanggal:** 3 April 2026  
**Status saat ini:** 28 artikel live  
**Fokus batch:** 8 artikel (#29–35)  
**Tema utama:** AI Production Reality + Cost Explosion + Pricing Reckoning  
**Target hari ini (3 Apr):** #29, #30, #31, #32 (+ #28 polish jika perlu) → 4–5 artikel  
**Target besok (4 Apr):** #33, #34, #35 → 3 artikel

Semua artikel harus long-form, opinionated, uncomfortable, dengan minimal 2–4 tabel meaningful, 1 trade-off table, dan 1 framework/mental model. Gunakan concrete numbers dari production scenarios (early/growth/scale). Paragraf 3–5 kalimat.

### #29 – AI Agents in Production: Why 78% of Pilots Never Reach Scale

**Hook:** “78% of companies are running AI agent pilots right now. Only 14% have anything meaningful in production. The other 64% are quietly burning budget in pilot purgatory.”

**False assumption:** “Kalau agent works di demo, tinggal deploy ke production dan scale otomatis.”

**Elemen wajib:**

- Tabel “5 Scaling Gaps” (reliability, cost control, observability, governance, handoff)
- Trade-off table: Framework-heavy (LangGraph/CrewAI) vs Custom orchestration
- Stage-based decision matrix (Early: speed, Growth: reliability, Scale: cost + governance)
- Framework: “Production Readiness Checklist” (5 checkpoints)

**Internal links:** #25 (OpenClaw), #27 (framework comparison sebelumnya), #23 (AI cost)

**Catatan produksi:** Ini prioritas #1 hari ini. Hook paling tajam & uncomfortable. Target 4000+ kata.

### #30 – The AI Cost Explosion: Token Prices Down 99%, Your Monthly Bill Up 320% — Here’s Why

**Hook:** “Token prices have crashed 99% in two years. Yet most AI SaaS teams are seeing their inference bills explode 3–10x. The math doesn’t lie — agentic usage is the silent killer.”

**False assumption:** “Lebih murah per token berarti total cost akan turun.”

**Elemen wajib:**

- Cost multiplier table (simple query vs agentic loop: 1x → 5–30x tokens)
- Before/after scenario table (pilot 100 users vs growth 10k users)
- Trade-off: Naive usage vs controlled agent design
- Mental model: “Agentic Multiplier Framework”

**Internal links:** #28 (Token Economics), #23 (AI cost explosion sebelumnya), #24

**Catatan produksi:** Langsung lanjutan #28 dan #29. Pakai angka realistis (320%+, 5-30x).

### #31 – Smart Routing & Self-Hosted: How Smart Teams Cut AI Costs 60–80% Without Losing Quality

**Hook:** “Most teams still route everything to the most expensive model. The smart ones quietly save 60–80% by routing intelligently — and many are already moving heavy traffic to self-hosted.”

**False assumption:** “Semua request butuh model frontier (GPT-4/Claude Opus).”

**Elemen wajib:**

- Routing framework (80/20 rule + 14–15 dimension scoring seperti ClawRouter)
- Cost simulation table (naive vs smart routing: $4660 → $1400 contoh nyata)
- Trade-off table: Pure API vs Hybrid (router + self-hosted Ollama/Gemma)
- Stage guidance: Early (simple router), Growth (hybrid), Scale (self-hosted dominant)

**Internal links:** #30, #28, #25 (OpenClaw)

**Catatan produksi:** Sangat actionable. Bisa pakai contoh ClawRouter/OpenClaw.

### #32 – RAG Is Not Free: The Brutal Cost Curve After 10 Million Records and When to Kill It

**Hook:** “Vector databases look cheap at 100k records. At 10 million, the bill becomes painful — and for many use cases, simpler markdown + search often wins anyway.”

**False assumption:** “RAG adalah solusi default yang scalable dan murah untuk semua knowledge base.”

**Elemen wajib:**

- Cost curve table (Pinecone/Weaviate vs self-hosted Qdrant/Chroma)
- When-to-kill-RAG decision framework (complexity vs volume matrix)
- Trade-off: Fancy RAG vs Simple retrieval + LLM
- Scenario: Early (RAG ok), Growth (cost spike), Scale (reevaluate)

**Internal links:** #30, #23, #24

**Catatan produksi:** Tambahkan angle “over-engineering regret” supaya uncomfortable.

### #33 – Outcome-Based Pricing: The Only SaaS Model That Survives the Agentic Era

**Hook:** “Per-seat pricing is already dead for AI products. Most founders just haven’t accepted the funeral yet.”

**False assumption:** “Kita bisa pakai model pricing SaaS klasik (per-seat/per-user) untuk produk berbasis agent.”

**Elemen wajib:**

- Per-seat vs Outcome/Usage vs Hybrid trade-off table
- Implementation challenges table (metering, bill shock prevention, value attribution)
- Decision framework berdasarkan stage perusahaan

**Internal links:** #28, #1 (pricing fundamentals), #13

**Catatan produksi:** Sangat opinionated — cocok tone Ravoid.

### #34 – Multi-Agent Orchestration: The Handoff Problem That Quietly Destroys Production Systems

**Hook:** “The real killer in multi-agent systems isn’t the model intelligence — it’s the silent failure when one agent hands off to another.”

**False assumption:** “Kalau tiap agent bekerja baik sendiri, sistem multi-agent akan otomatis reliable.”

**Elemen wajib:**

- Handoff failure patterns table (state loss, context drift, responsibility gap)
- Orchestration trade-off (centralized graph vs decentralized delegation)
- Mental model: “Agent Handoff Contract”

**Internal links:** #29, #25, #31

**Catatan produksi:** Masih emerging, tapi painful di production.

### #35 – AI Observability: Why Traditional Monitoring Is Completely Useless for Agentic Systems

**Hook:** “You can’t fix what you can’t see. And traditional logs + metrics see almost nothing when agents are reasoning, looping, and calling tools autonomously.”

**False assumption:** “Monitoring yang kita pakai untuk microservices cukup untuk AI agents.”

**Elemen wajib:**

- New observability requirements table (prompt drift, trajectory tracing, cost per trajectory)
- Trade-off: Traditional tools vs AI-native observability (LangSmith, Langfuse, custom)
- Stage-based guidance

**Internal links:** #29, #34, #30

**Catatan produksi:** Tutup batch dengan gap besar di production.

## Rekomendasi Tambahan

- **Urutan publish ideal:** #29 → #30 → #31 → #32 → #33 → #34 → #35 (membangun narasi dari problem → solusi parsial → pricing shift → deeper production issues)
- **Internal linking:** Minimal 3–4 link per artikel, buat natural (bukan list).
- **Fleksibilitas:** Kalau besok ada berita besar di X tentang agent scaling atau cost, kita bisa adjust #34/#35.
- **Newsletter angle:** Batch ini bisa jadi “AI Production & Cost Survival Series”.

Plan ini sudah cukup detail untuk langsung generate, tapi tetap fleksibel.

Mau saya buatkan **full outline super detail** (dengan struktur paragraf, tabel spesifik, dan contoh angka) untuk salah satu artikel dulu?  
Misalnya mulai dari **#29** (prioritas utama hari ini)?

Atau mau revisi judul/hook salah satu artikel?  
Kasih tahu mana yang mau kita kerjakan selanjutnya.
