import React from 'react';
import axios from 'axios';

function EmailItem({ email }) {
  const downloadAttachment = async (messageId, attachmentId, filename) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/download/${messageId}/${attachmentId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      const byteCharacters = atob(response.data.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{email.subject}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{email.sender}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          {new Date(parseInt(email.timestamp)).toLocaleString()}
        </p>
      </div>
      {email.attachments.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Attachments:</p>
          <div className="flex flex-wrap gap-2">
            {email.attachments.map((attachment) => (
              <button
                key={attachment.attachmentId}
                onClick={() =>
                  downloadAttachment(
                    attachment.messageId,
                    attachment.attachmentId,
                    attachment.filename
                  )
                }
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                {attachment.filename}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailItem;