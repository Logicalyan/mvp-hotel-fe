  // lib/services/auth.js
  import api from "../api"
  import { clearAuth, getToken, setAuth } from "../storage/authStorage";
  // Login
  export async function login(email, password) {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 LOGIN REQUEST:');
      console.log('  - email:', email);
      console.log('  - password:', password ? '***' : 'MISSING');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const res = await api.post("/login", { email, password });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 LOGIN API RESPONSE - FULL STRUCTURE:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('res.data:', JSON.stringify(res.data, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Extract data - handle different API response structures
      const responseData = res.data.data || res.data;
      const { user, token } = responseData;

      console.log('📦 Extracted Data:');
      console.log('  - token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
      console.log('  - user object:', JSON.stringify(user, null, 2));

      if (!user) {
        throw new Error('User data not found in API response');
      }

      if (!token) {
        throw new Error('Token not found in API response');
      }

      // ✅ Extract role with multiple fallback strategies
      let role = null;
      let hotel_id = null;

      // Strategy 1: user.role (most common)
      if (user.role) {
        role = user.role;
        console.log('✅ Role found in user.role:', role);
      }
      // Strategy 2: user.roles (array)
      else if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        role = user.roles[0];
        console.log('✅ Role found in user.roles[0]:', role);
      }
      // Strategy 3: responseData.role (root level)
      else if (responseData.role) {
        role = responseData.role;
        console.log('✅ Role found in responseData.role:', role);
      }
      else {
        console.error('❌ ROLE NOT FOUND IN ANY LOCATION!');
        console.error('Available user keys:', Object.keys(user));
        console.error('Available responseData keys:', Object.keys(responseData));
        throw new Error('Role not found in API response');
      }

      // Extract hotel_id
      hotel_id = user.hotel_id || responseData.hotel_id || null;

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 FINAL EXTRACTED VALUES:');
      console.log('  - role:', role, `(type: ${typeof role})`);
      console.log('  - hotel_id:', hotel_id, `(type: ${typeof hotel_id})`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Validate role before saving
      if (!role || role === 'undefined' || role === 'null') {
        throw new Error(`Invalid role value: ${role}`);
      }

      // Save to storage
      setAuth(token, role, hotel_id);

      // Return normalized data
      return {
        user: {
          ...user,
          role: role,
          hotel_id: hotel_id
        },
        role: role
      };

    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ LOGIN ERROR:');
      console.error('  Message:', error.message);
      console.error('  Status:', error.response?.status);
      console.error('  Status Text:', error.response?.statusText);
      console.error('  Backend Error:', error.response?.data);
      console.error('  Full error:', error);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Provide more helpful error messages
      if (error.response?.status === 500) {
        throw new Error(`Server error (500): ${error.response?.data?.message || 'Backend mengalami masalah. Silakan cek kredensial atau hubungi administrator.'}`);
      } else if (error.response?.status === 401) {
        throw new Error('Email atau password salah');
      } else if (error.response?.status === 422) {
        throw new Error('Data tidak valid. Periksa email dan password Anda.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  }

  // Register
  export async function register(name, email, password) {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 REGISTER API REQUEST:');
      console.log('  - name:', name);
      console.log('  - email:', email);
      console.log('  - password:', password ? '***' : 'MISSING');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const res = await api.post("/register", { name, email, password });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ REGISTER API RESPONSE:');
      console.log('  - Full response:', JSON.stringify(res.data, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return res.data.data;

    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ REGISTER ERROR:');
      console.error('  - Message:', error.message);
      console.error('  - Response:', error.response?.data);
      console.error('  - Status:', error.response?.status);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Throw dengan message yang lebih jelas
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 422) {
        throw new Error('Email sudah terdaftar atau data tidak valid');
      } else {
        throw new Error('Registrasi gagal. Silakan coba lagi.');
      }
    }
  }

  // Logout
  export async function logout() {
    try {
      // Try to notify backend first (while token is still valid)
      await api.post("/logout");
      console.log("✅ Logout API call successful");
    } catch (e) {
      console.warn("⚠️ Logout API request failed:", e.message);
      // Continue with local logout even if backend fails
    } finally {
      // Always clear auth, regardless of API response
      clearAuth();
    }
  }

  // Get Current User
  export async function getCurrentUser() {
    try {
      const token = getToken();
      if (!token) {
        console.log('⚠️ No token found');
        return null;
      }

      const res = await api.get("/user");
      console.log('🔍 /me Response:', res.data);

      // Handle different response structures
      const responseData = res.data.data || res.data;
      
      if (!responseData) {
        console.warn('⚠️ No user data in response');
        return null;
      }

      const user = responseData;

      // ✅ Ambil role dengan fallback strategies
      let role = null;
      
      // Strategy 1: user.role
      if (user && user.role) {
        role = user.role;
        console.log('✅ Role found in user.role:', role);
      }
      // Strategy 2: user.roles (array)
      else if (user && user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
        role = user.roles[0];
        console.log('✅ Role found in user.roles[0]:', role);
      }
      else {
        console.warn('⚠️ Role not found, defaulting to "user"');
        role = 'user'; // Default role
      }

      const hotelId = user?.hotel_id || null;

      console.log('👤 Current User:', user);
      console.log('🎭 Current Role:', role);
      console.log('🏨 Current Hotel ID:', hotelId);

      return {
        user: {
          ...user,
          role: role,
          hotel_id: hotelId
        },
        role: role
      };
    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error);
      return null;
    }
  }

