import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lijbgohsqxifcnebyawg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpamJnb2hzcXhpZmNuZWJ5YXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM5MDk4OTcsImV4cCI6MTk3OTQ4NTg5N30.g45RAFKufjtIQM6NsrhzOjjnbsQlQI9nn36XEzRjEpw';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
