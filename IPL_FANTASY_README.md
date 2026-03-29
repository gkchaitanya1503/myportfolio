# 🏏 IPL Fantasy Bot — IamGK
Automated daily checker for IPL 2026 Fantasy on iplt20.com
## Schedule
| Time IST | Action |
|----------|--------|
| 2:00 PM daily | Full squad check + match preview |
| 7:00 PM daily | Toss time alert |
## Phone Notifications (Free)
1. Install **ntfy** app (iOS/Android)
2. Subscribe to topic: `iamgk-ipl-fantasy`
## After Each Transfer
Update `config.py`:
- `CURRENT_SQUAD` — new players
- `TRANSFERS_USED` — updated count
- `CAPTAIN` / `VICE_CAPTAIN`
- `BOOSTERS` — if used one
Then push to GitHub — bot auto-updates.
## Manual Run
GitHub → Actions → IPL Fantasy Daily Bot → Run workflow
