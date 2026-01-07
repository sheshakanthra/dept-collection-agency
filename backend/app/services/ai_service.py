def calculate_priority(amount_due, ageing_days):
    score = 0

    if amount_due > 300000:
        score += 40
    elif amount_due > 100000:
        score += 25
    else:
        score += 10

    if ageing_days > 90:
        score += 40
    elif ageing_days > 60:
        score += 25
    else:
        score += 10

    if score >= 70:
        priority = "High"
    elif score >= 40:
        priority = "Medium"
    else:
        priority = "Low"

    recovery_probability = max(20, 100 - score)

    return priority, recovery_probability

def explain_priority(amount_due, ageing_days):
    reasons = []

    if amount_due > 300000:
        reasons.append("High outstanding amount (> ₹3,00,000)")
    elif amount_due > 100000:
        reasons.append("Moderate outstanding amount (> ₹1,00,000)")
    else:
        reasons.append("Low outstanding amount")

    if ageing_days > 90:
        reasons.append("Debt overdue for more than 90 days")
    elif ageing_days > 60:
        reasons.append("Debt overdue for more than 60 days")
    else:
        reasons.append("Recently overdue account")

    return reasons
