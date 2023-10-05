import csv
import smtplib
import ssl
import time
from asyncio import sleep
import schedule

from main import fetch_user_emails, mail, not_uploaded_mail_body, schedule_jobs
# Schedule the job to run daily
schedule.every(86400).seconds.do(schedule_jobs)

# Run the scheduler loop (this script should be invoked externally)
while True:
    schedule.run_pending()
    time.sleep(1)