from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv
import os
import base64

load_dotenv()

def get_gmail_service():
    try:
        creds = Credentials(
            token=None,
            refresh_token=os.getenv("GOOGLE_REFRESH_TOKEN"),
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
            token_uri="https://oauth2.googleapis.com/token",
            scopes=["https://www.googleapis.com/auth/gmail.readonly"]
        )
        return build('gmail', 'v1', credentials=creds)
    except Exception as e:
        print(f"Failed to create Gmail service: {e}")
        raise

def get_emails():
    service = get_gmail_service()
    results = service.users().messages().list(userId='me', maxResults=10).execute()
    messages = results.get('messages', [])
    
    emails = []
    for message in messages:
        msg = service.users().messages().get(userId='me', id=message['id']).execute()
        headers = msg['payload']['headers']
        
        email_data = {
            'sender': next(h['value'] for h in headers if h['name'] == 'From'),
            'subject': next(h['value'] for h in headers if h['name'] == 'Subject'),
            'timestamp': msg['internalDate'],
            'attachments': []
        }
        
        if 'parts' in msg['payload']:
            for part in msg['payload']['parts']:
                if part.get('filename'):
                    attachment = {
                        'filename': part['filename'],
                        'attachmentId': part['body']['attachmentId'],
                        'messageId': message['id']
                    }
                    email_data['attachments'].append(attachment)
        
        emails.append(email_data)
    return emails

def get_attachment(message_id: str, attachment_id: str):
    service = get_gmail_service()
    attachment = service.users().messages().attachments().get(
        userId='me',
        messageId=message_id,
        id=attachment_id
    ).execute()
    return attachment['data']