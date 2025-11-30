import api from "@/lib/api"

export async function getHotels(page = 1, filters = {}, pageSize = 10) {
  try {
    const params = new URLSearchParams({
      page,
      per_page: pageSize,
    })

    // Loop semua filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return

      if (Array.isArray(value)) {
        if (value.length > 0) {
          // contoh: facilities=1,2,3
          params.append(key, value.join(","))
        }
      } else {
        params.append(key, value.toString())
      }
    })

    const url = `/hotels?${params.toString()}`
    console.log('🏨 [Client] Fetching from:', url)
    
    const res = await api.get(url)
    console.log('🏨 [Client] Response status:', res.status)
    console.log('🏨 [Client] Response data type:', typeof res.data)
    console.log('🏨 [Client] Response data:', res.data)
    
    // Validate response is not HTML (error page from ngrok)
    if (typeof res.data === 'string') {
      console.error('❌ [Client] Response is string (HTML), not JSON')
      console.error('Response content preview:', res.data.substring(0, 200))
      
      if (res.data.includes('<!DOCTYPE') || res.data.includes('ngrok')) {
        console.error('❌ Backend appears to be offline or ngrok tunnel issue')
      }
      
      return {
        meta: { current_page: 1, last_page: 1, total: 0, per_page: pageSize },
        hotels: [],
      }
    }

    // Extract data with fallback strategies
    const hotelData = res.data?.data?.data || res.data?.data || res.data || []
    const meta = res.data?.data || { current_page: page, last_page: 1, total: hotelData.length, per_page: pageSize }
    
    console.log('✅ [Client] Extracted hotels:', hotelData)
    console.log('✅ [Client] Meta:', meta)

    return {
      meta: {
        current_page: meta.current_page || page,
        last_page: meta.last_page || 1,
        total: meta.total || hotelData.length,
        per_page: meta.per_page || pageSize,
      },
      hotels: Array.isArray(hotelData) ? hotelData : [],
    }
  } catch (error) {
    console.error('❌ [Client] Error fetching hotels:', error.message)
    console.error('❌ [Client] Error response:', error.response?.data || error.response?.status)
    
    return {
      meta: { current_page: 1, last_page: 1, total: 0, per_page: pageSize },
      hotels: [],
    }
  }
}
