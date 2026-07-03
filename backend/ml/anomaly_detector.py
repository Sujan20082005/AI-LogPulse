def detect_anomaly(level):
    if level == "ERROR":
        return "CRITICAL"

    if level == "WARNING":
        return "MEDIUM"

    return "NORMAL"