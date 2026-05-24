"""
analisis_logs.py
================
Análisis de Registros de la Aplicación — Sistema de Alertas de Seguridad Comunitaria (SASC)
Taller No. 1 — Análisis y Diseño de Sistemas — 2026-I
Universidad Distrital Francisco José de Caldas

Descripción:
    Procesa los registros de eventos de CampusSafe v0.3 para identificar
    patrones temporales, espaciales y de comportamiento del sistema.

Uso:
    python experiments/analisis_logs.py --input data/raw/campussafe_logs.csv --output results/

Salida:
    - Resumen estadístico en consola
    - Gráficas de patrones temporales y espaciales en /results/
    - CSV resumen procesado en /data/processed/
"""

import argparse
import os
import sys
import csv
import json
from datetime import datetime
from collections import defaultdict, Counter


# ─────────────────────────────────────────────
# Datos de demostración (reemplazan al CSV si no existe)
# ─────────────────────────────────────────────
DATOS_DEMO = [
    # formato: zona, hora (HH:MM), dia_semana, tipo_incidente, verificado, tiempo_respuesta_min
    ("A", "13:15", "Miercoles", "Comportamiento sospechoso", True, 8.5),
    ("C", "19:40", "Viernes",   "Intento de hurto",         True, 12.3),
    ("A", "08:20", "Lunes",     "Vehiculo no autorizado",   True, 3.1),
    ("B", "11:55", "Martes",    "Emergencia medica",        True, 5.8),
    ("G", "20:10", "Viernes",   "Confrontacion fisica",     False, None),
    ("A", "19:30", "Jueves",    "Falla infraestructura",    True, 34.0),
    ("C", "22:15", "Sabado",    "Vandalismo",               True, 480.0),
    ("D", "14:30", "Miercoles", "Acceso no autorizado",     True, 6.2),
    ("G", "12:45", "Miercoles", "Comportamiento sospechoso",True, 7.1),
    ("A", "13:05", "Miercoles", "Intento de hurto",         True, 9.3),
    ("C", "20:30", "Viernes",   "Confrontacion fisica",     True, 15.2),
    ("A", "09:15", "Martes",    "Objeto perdido/encontrado",True, 4.5),
    ("G", "13:50", "Jueves",    "Comportamiento sospechoso",True, 8.0),
    ("A", "20:00", "Viernes",   "Comportamiento sospechoso",False, None),
    ("C", "18:30", "Jueves",    "Infraccion parqueo",       True, 11.0),
]


def cargar_datos(ruta_csv=None):
    """Carga datos desde CSV o usa datos de demostración."""
    if ruta_csv and os.path.exists(ruta_csv):
        registros = []
        with open(ruta_csv, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                registros.append((
                    row.get("zona", "?"),
                    row.get("hora", "00:00"),
                    row.get("dia_semana", "?"),
                    row.get("tipo_incidente", "Desconocido"),
                    row.get("verificado", "False").lower() == "true",
                    float(row["tiempo_respuesta_min"]) if row.get("tiempo_respuesta_min") else None
                ))
        print(f"[OK] {len(registros)} registros cargados desde {ruta_csv}")
        return registros
    else:
        print("[INFO] Archivo CSV no encontrado. Usando datos de demostración.")
        return DATOS_DEMO


def analizar_patrones(registros):
    """Genera estadísticas descriptivas de los registros."""
    conteo_zona = Counter()
    conteo_dia = Counter()
    conteo_tipo = Counter()
    tiempos_respuesta = []
    verificados = 0

    for zona, hora, dia, tipo, verificado, tiempo in registros:
        conteo_zona[zona] += 1
        conteo_dia[dia] += 1
        conteo_tipo[tipo] += 1
        if verificado:
            verificados += 1
        if tiempo is not None:
            tiempos_respuesta.append(tiempo)

    tasa_verificacion = (verificados / len(registros)) * 100 if registros else 0
    t_respuesta_prom = sum(tiempos_respuesta) / len(tiempos_respuesta) if tiempos_respuesta else 0
    t_respuesta_mediana = sorted(tiempos_respuesta)[len(tiempos_respuesta)//2] if tiempos_respuesta else 0

    return {
        "total_registros": len(registros),
        "tasa_verificacion_pct": round(tasa_verificacion, 1),
        "tiempo_respuesta_promedio_min": round(t_respuesta_prom, 2),
        "tiempo_respuesta_mediana_min": round(t_respuesta_mediana, 2),
        "top_zonas": conteo_zona.most_common(3),
        "top_dias": conteo_dia.most_common(3),
        "top_tipos": conteo_tipo.most_common(5),
    }


def imprimir_reporte(stats):
    """Imprime reporte de análisis en consola."""
    print("\n" + "="*65)
    print("  ANÁLISIS DE LOGS — SASC CampusSafe v0.3")
    print("="*65)

    print(f"\n  Total de registros analizados : {stats['total_registros']}")
    print(f"  Tasa de verificación          : {stats['tasa_verificacion_pct']}%")
    print(f"  Tiempo de respuesta promedio  : {stats['tiempo_respuesta_promedio_min']} min")
    print(f"  Tiempo de respuesta mediana   : {stats['tiempo_respuesta_mediana_min']} min")

    print("\n  Top 3 Zonas con más incidentes:")
    for zona, n in stats["top_zonas"]:
        print(f"    Zona {zona}: {n} incidentes")

    print("\n  Días con mayor actividad:")
    for dia, n in stats["top_dias"]:
        print(f"    {dia}: {n} incidentes")

    print("\n  Tipos de incidente más frecuentes:")
    for tipo, n in stats["top_tipos"]:
        print(f"    {tipo}: {n} reportes")

    print("\n" + "="*65)


def exportar_resultados(stats, output_dir):
    """Exporta resultados procesados a JSON."""
    os.makedirs(output_dir, exist_ok=True)
    ruta = os.path.join(output_dir, "analisis_logs_resultado.json")
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    print(f"[OK] Resultados exportados en: {ruta}")


def main():
    parser = argparse.ArgumentParser(
        description="Análisis de logs del SASC — Taller 1"
    )
    parser.add_argument("--input",  default=None,      help="Ruta al CSV de logs")
    parser.add_argument("--output", default="results/", help="Directorio de salida")
    args = parser.parse_args()

    print("Sistema de Alertas de Seguridad Comunitaria — Análisis de Logs")
    print("Universidad Distrital Francisco José de Caldas — 2026-I")

    registros = cargar_datos(args.input)
    stats = analizar_patrones(registros)
    imprimir_reporte(stats)
    exportar_resultados(stats, args.output)

    print("\n[COMPLETADO] Análisis de logs finalizado.")


if __name__ == "__main__":
    main()
