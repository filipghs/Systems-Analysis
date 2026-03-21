## Workshop No. 2 — Systems Design

**System:** Community Security Alert System (CSAS)  
**Semester:** 2026-I

### Overview
Complete systems design for the CSAS platform, translating the empirical
findings of Workshop No. 1 into a microservices-based, event-driven
architecture with hybrid AI-and-human verification and geofenced alert dispatch.

### Key Design Decisions
- Microservices-based, event-driven architecture
- Adaptive verification engine with zone and time weighting
- Mobile-first reporting interface (≤ 3 taps to submit)
- Complementary integration with existing SIURE UD system

### Deliverables
| Deliverable | Link |
|---|---|
| System Design Document (PDF) | [CSAS_W2_final.pdf](./CSAS_W2_final.pdf) |
| LaTeX Source | [CSAS_W2_final.tex](./CSAS_W2_final.tex) |
| Architecture Diagram | [fig1_architecture.png](./diagrams/fig1_architecture.png) |
| Process Flow Diagram | [fig2_processflow.png](./diagrams/fig2_processflow.png) |
```

5. Abajo en **Commit new file** escribe el mensaje:
```
Add Workshop 2 folder and README
```
6. Click **Commit new file** ✓

---

## Paso 2 — Subir el PDF y el .tex

1. Entra a la carpeta `Workshop_2_Design` que acabas de crear
2. Click **Add file → Upload files**
3. Arrastra estos dos archivos que descargaste:
   - `CSAS_W2_final.pdf`
   - `CSAS_W2_final.tex`
4. Mensaje de commit:
```
Add system design document (PDF and LaTeX source)
```
5. Click **Commit changes** ✓

---

## Paso 3 — Crear subcarpeta y subir los diagramas

GitHub no permite crear carpetas vacías, así que se hace en dos sub-pasos.

**3a.** Estando dentro de `Workshop_2_Design`, click **Add file → Create new file**. Escribe:
```
diagrams/placeholder.md
```
Contenido: `# Diagrams`. Commit con el mensaje:
```
Create diagrams folder
```

**3b.** Entra a la carpeta `diagrams`, click **Add file → Upload files** y sube:
   - `fig1_architecture.png`
   - `fig2_processflow.png`

Mensaje de commit:
```
Add architecture and process flow diagrams
