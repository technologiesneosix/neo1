import axios from 'axios';

const runTest = async () => {
  const url = 'http://127.0.0.1:5000/api/v1/public/faqs';
  console.log(`Sending requests to ${url} to test rate limiting...`);

  let successCount = 0;
  let blockedCount = 0;
  let blockedMessage = '';

  for (let i = 0; i < 120; i++) {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        successCount++;
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        blockedCount++;
        blockedMessage = JSON.stringify(error.response.data);
      } else {
        console.error(`Request failed with status ${error.response?.status}: ${error.message}`);
      }
    }
  }

  console.log(`Test completed.`);
  console.log(`Success requests count: ${successCount}`);
  console.log(`Blocked (429) requests count: ${blockedCount}`);
  console.log(`Blocked response message: ${blockedMessage}`);

  if (blockedCount > 0) {
    console.log('PASS: Rate limiting works and successfully blocks excessive requests.');
    process.exit(0);
  } else {
    console.log('FAIL: Rate limiting did not block requests.');
    process.exit(1);
  }
};

runTest();
