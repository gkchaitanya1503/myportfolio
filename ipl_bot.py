#!/usr/bin/env python3
"""
IPL Fantasy Daily Bot - IamGK
Runs daily to check squad, transfers, and generate match advice
"""
from datetime import datetime, timedelta, timezone
from config import *
def get_ist_now():
    utc_now = datetime.now(timezone.utc)
    return utc_now + timedelta(hours=5, minutes=30)
def get_todays_matches():
    now = get_ist_now()
    today = now.strftime("%Y-%m-%d")
    tomorrow = (now + timedelta(days=1)).strftime("%Y-%m-%d")
    return [m for m in SCHEDULE if m["date"] in [today, tomorrow]]
def get_active_players(match):
    teams = match["teams"]
    active = [p for p, info in CURRENT_SQUAD.items() if info["team"] in teams]
    idle   = [p for p, info in CURRENT_SQUAD.items() if info["team"] not in teams]
    return active, idle
def check_issues():
    issues = []
    overseas = sum(1 for p in CURRENT_SQUAD.values() if p["overseas"])
    if overseas > 4:
        issues.append(f"🚨 OVERSEAS LIMIT BREACHED: {overseas}/4 players")
    for name in CURRENT_SQUAD:
        for ua in UNAVAILABLE_PLAYERS:
            if ua.lower() in name.lower():
                issues.append(f"🚨 {name} is INJURED/UNAVAILABLE!")
    transfers_left = TRANSFERS_TOTAL - TRANSFERS_USED
    if transfers_left < 15:
        issues.append(f"⚠️ LOW TRANSFERS: Only {transfers_left} remaining!")
    return issues
def booster_advice(match_num):
    if match_num <= 5:
        return "🚫 TOO EARLY — Save all boosters!"
    elif match_num <= 15:
        return "🟡 Consider Indian Warriors or Foreign Stars only"
    elif match_num <= 40:
        return "🎯 Good window for Double Power or Triple Captain"
    else:
        return "⚡ Use remaining boosters — playoffs approaching!"
def run_report():
    now = get_ist_now()
    print("\n" + "🏏" * 22)
    print(f"  IPL FANTASY DAILY REPORT — IamGK")
    print(f"  {now.strftime('%A %d %B %Y, %H:%M IST')}")
    print("🏏" * 22)
    # Issues
    issues = check_issues()
    if issues:
        print("\n⚠️  SQUAD ISSUES:")
        for i in issues: print(f"   {i}")
    else:
        print("\n✅ No squad issues detected")
    # Transfers & Boosters
    left = TRANSFERS_TOTAL - TRANSFERS_USED
    total_boosters = sum(BOOSTERS.values())
    print(f"\n📊 TRANSFERS: {TRANSFERS_USED} used / {left} remaining")
    print(f"⚡ BOOSTERS:  {total_boosters} remaining — ", end="")
    for b, c in BOOSTERS.items():
        if c > 0: print(f"{b}×{c}", end="  ")
    print()
    # Match reports
    upcoming = get_todays_matches()
    if not upcoming:
        print("\n📅 No matches today/tomorrow. Next matches:")
        for m in SCHEDULE[:4]:
            active, _ = get_active_players(m)
            print(f"   M{m['match']} {m['date']}: {' vs '.join(m['teams'])} — {len(active)}/11 active")
    else:
        for m in upcoming:
            active, idle = get_active_players(m)
            print(f"\n{'='*52}")
            print(f"🏏 MATCH {m['match']}: {' vs '.join(m['teams'])}")
            print(f"📍 {m['venue']}  ⏰ {m['date']} {m['time']} IST")
            print(f"{'='*52}")
            print(f"\n✅ ACTIVE ({len(active)}/11):")
            for p in active:
                info = CURRENT_SQUAD[p]
                tags = ""
                if p == CAPTAIN: tags = " 👑 C"
                elif p == VICE_CAPTAIN: tags = " ⭐ VC"
                print(f"   • {p} ({info['role']}, {info['credits']}Cr){tags}")
            if idle:
                print(f"\n❌ IDLE ({len(idle)}/11) — scores 0:")
                for p in idle:
                    print(f"   • {p} ({CURRENT_SQUAD[p]['team']})")
            if len(active) < 7:
                print(f"\n🚨 URGENT: Only {len(active)} active players! Make transfers NOW!")
            transfers_needed = max(0, 7 - len(active))
            print(f"\n💡 TRANSFERS: {left} remaining — need ~{transfers_needed} move(s) for this match")
            print(f"⚡ BOOSTER:  {booster_advice(m['match'])}")
    # 5-match preview
    print(f"\n📅 NEXT 5 MATCHES:")
    for m in SCHEDULE[:5]:
        active, _ = get_active_players(m)
        bar = "🟢" if len(active) >= 7 else ("🟡" if len(active) >= 4 else "🔴")
        print(f"   {bar} M{m['match']} {m['date']}: {' vs '.join(m['teams'])} — {len(active)}/11 active")
    print(f"\n{'='*52}")
    print("💡 Update config.py after each transfer and push to GitHub")
    print(f"{'='*52}\n")
if __name__ == "__main__":
    run_report()
