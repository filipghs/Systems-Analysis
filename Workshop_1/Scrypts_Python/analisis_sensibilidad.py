"""
analisis_sensibilidad.py
========================
Análisis de Sensibilidad — Sistema de Alertas de Seguridad Comunitaria (SASC)
Taller No. 1 — Análisis y Diseño de Sistemas — 2026-I
Universidad Distrital Francisco José de Caldas

Descripción:
    Este script modela cómo varían las métricas clave del SASC
    (tiempo de respuesta, tasa de verificación) ante cambios en
    los parámetros más sensibles del sistema.

Uso:
    python experiments/analisis_sensibilidad.py

Salida:
    - Tablas de sensibilidad en consola
    - Gráficas exportadas a /results/
"""

import numpy as np
import matplotlib.pyplot as plt
import os

# ─────────────────────────────────────────────
# Parámetros base del sistema (valores medidos)
# ─────────────────────────────────────────────
PARAMS_BASE = {
    "reportantes_por_zona": 12,       # usuarios activos
    "umbral_verificacion": 3,          # confirmaciones requeridas
    "latencia_red_ms": 85,             # ms promedio campus
    "oficiales_por_turno": 2,          # número de oficiales
    "tasa_falsos_positivos": 0.08,     # 8%
}

TIEMPO_RESPUESTA_BASE = 11.4          # minutos (medido)


def modelo_tiempo_respuesta(reportantes, umbral, latencia_ms, oficiales, fp_rate):
    """
    Modelo simplificado del tiempo total de respuesta del SASC.

    Componentes:
      - Tiempo de verificación: función del número de reportantes y umbral
      - Latencia de red: impacto no lineal por encima de 200ms
      - Retraso de despacho: función del número de oficiales disponibles
      - Penalización por falsos positivos: erosión de confianza del sistema
    """
    # Componente 1: Tiempo de verificación (minutos)
    # A más reportantes por zona, más rápido se alcanza el umbral
    if reportantes < 1:
        reportantes = 1
    t_verificacion = (umbral * 1.5) / np.log1p(reportantes)

    # Componente 2: Latencia de red convertida a minutos
    if latencia_ms <= 200:
        t_red = latencia_ms / 1000 / 60
    else:
        # Impacto exponencial por encima de 200ms
        t_red = (latencia_ms / 1000 / 60) * (1 + ((latencia_ms - 200) / 200) ** 1.5)

    # Componente 3: Retraso de despacho humano (minutos)
    # Menos oficiales = más tiempo de espera de autorización
    t_despacho = 4.0 / np.sqrt(oficiales)

    # Componente 4: Penalización por falsos positivos
    # Cada 5% de FP agrega ~3 minutos por erosión de confianza/saturación
    t_fp = (fp_rate / 0.05) * 3.0

    return t_verificacion + t_red + t_despacho + t_fp


def analizar_sensibilidad_parametro(param_nombre, valores, etiqueta_x, titulo):
    """
    Calcula el tiempo de respuesta variando un parámetro mientras
    mantiene los demás en sus valores base.
    """
    tiempos = []
    params = PARAMS_BASE.copy()

    for val in valores:
        params[param_nombre] = val
        t = modelo_tiempo_respuesta(
            params["reportantes_por_zona"],
            params["umbral_verificacion"],
            params["latencia_red_ms"],
            params["oficiales_por_turno"],
            params["tasa_falsos_positivos"]
        )
        tiempos.append(t)

    return tiempos


def graficar_sensibilidad(resultados, output_dir="results"):
    """Genera gráficas de sensibilidad para cada parámetro analizado."""
    os.makedirs(output_dir, exist_ok=True)

    fig, axes = plt.subplots(2, 3, figsize=(16, 10))
    fig.suptitle(
        "Análisis de Sensibilidad — SASC\n"
        "Impacto de parámetros clave sobre el Tiempo de Respuesta (minutos)",
        fontsize=13, fontweight="bold", y=1.01
    )

    colores = ["#2E75B6", "#1F4E79", "#2980B9", "#117A65", "#E74C3C"]

    for idx, (nombre, datos) in enumerate(resultados.items()):
        ax = axes[idx // 3][idx % 3]
        ax.plot(datos["x"], datos["y"], color=colores[idx % len(colores)],
                linewidth=2.5, marker="o", markersize=4)
        ax.axhline(y=TIEMPO_RESPUESTA_BASE, color="gray",
                   linestyle="--", alpha=0.6, label=f"Base: {TIEMPO_RESPUESTA_BASE} min")
        ax.axhline(y=5.0, color="green",
                   linestyle="--", alpha=0.6, label="Objetivo: 5,0 min")
        ax.set_title(datos["titulo"], fontsize=10, fontweight="bold")
        ax.set_xlabel(datos["xlabel"], fontsize=9)
        ax.set_ylabel("Tiempo de respuesta (min)", fontsize=9)
        ax.legend(fontsize=8)
        ax.grid(True, alpha=0.3)
        ax.set_ylim(0, max(datos["y"]) * 1.15)

    # Ocultar subplot sobrante
    axes[1][2].set_visible(False)

    plt.tight_layout()
    ruta = os.path.join(output_dir, "sensibilidad_sasc.png")
    plt.savefig(ruta, dpi=150, bbox_inches="tight")
    print(f"[OK] Gráfica guardada en: {ruta}")
    plt.close()


def imprimir_tabla_sensibilidad(resultados):
    """Imprime tabla resumen de sensibilidad en consola."""
    print("\n" + "="*70)
    print("TABLA DE SENSIBILIDAD — SASC (Tiempo de Respuesta en minutos)")
    print("="*70)
    for nombre, datos in resultados.items():
        print(f"\n  Parámetro: {datos['titulo']}")
        print(f"  {'Valor':>15} | {'T. Respuesta (min)':>20} | {'Var. respecto base':>20}")
        print("  " + "-"*60)
        for x, y in zip(datos["x"], datos["y"]):
            variacion = ((y - TIEMPO_RESPUESTA_BASE) / TIEMPO_RESPUESTA_BASE) * 100
            signo = "+" if variacion >= 0 else ""
            print(f"  {str(x):>15} | {y:>20.2f} | {signo}{variacion:>19.1f}%")
    print("\n" + "="*70)


def main():
    print("Sistema de Alertas de Seguridad Comunitaria — Análisis de Sensibilidad")
    print("Universidad Distrital Francisco José de Caldas — 2026-I\n")

    # ─────────────────────────────────────────────
    # Definición de rangos de variación por parámetro
    # ─────────────────────────────────────────────
    resultados = {

        "reportantes_por_zona": {
            "x": list(range(1, 51, 2)),
            "y": analizar_sensibilidad_parametro(
                "reportantes_por_zona", range(1, 51, 2), "", ""),
            "titulo": "Reportantes Activos por Zona",
            "xlabel": "Número de reportantes activos"
        },

        "umbral_verificacion": {
            "x": list(range(1, 8)),
            "y": analizar_sensibilidad_parametro(
                "umbral_verificacion", range(1, 8), "", ""),
            "titulo": "Umbral de Verificación\n(# confirmaciones requeridas)",
            "xlabel": "Número de confirmaciones requeridas"
        },

        "latencia_red_ms": {
            "x": [30, 50, 85, 120, 200, 300, 500, 800],
            "y": analizar_sensibilidad_parametro(
                "latencia_red_ms", [30, 50, 85, 120, 200, 300, 500, 800], "", ""),
            "titulo": "Latencia de Red (WiFi Campus)",
            "xlabel": "Latencia promedio (ms)"
        },

        "oficiales_por_turno": {
            "x": list(range(1, 7)),
            "y": analizar_sensibilidad_parametro(
                "oficiales_por_turno", range(1, 7), "", ""),
            "titulo": "Oficiales de Seguridad por Turno",
            "xlabel": "Número de oficiales disponibles"
        },

        "tasa_falsos_positivos": {
            "x": [0.02, 0.05, 0.08, 0.10, 0.15, 0.20, 0.25],
            "y": analizar_sensibilidad_parametro(
                "tasa_falsos_positivos",
                [0.02, 0.05, 0.08, 0.10, 0.15, 0.20, 0.25], "", ""),
            "titulo": "Tasa de Falsos Positivos",
            "xlabel": "Proporción de falsos positivos"
        },
    }

    imprimir_tabla_sensibilidad(resultados)
    graficar_sensibilidad(resultados)

    print("\n[COMPLETADO] Análisis de sensibilidad finalizado.")
    print("Revise /results/sensibilidad_sasc.png para las gráficas.")


if __name__ == "__main__":
    main()
