import { config } from 'dotenv';
import { testConnections } from '../src/utils/test-connections';

// Load environment variables from .env file
config();

console.log('🚀 Starting API Connection Tests...\n');

testConnections()
  .then(() => {
    console.log('\n✨ All tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  }); 