import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lwfmwngjjfecrjdbyghh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3Zm13bmdqamZlY3JqZGJ5Z2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Njc2OTYsImV4cCI6MjA3MTU0MzY5Nn0.dxgOP1c3sPh8rE0P1aaehN7ZsxyurszHZ-8GMmlgvD4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库操作封装
export const db = {
  // 产品相关
  async getProducts(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        applications:product_applications(
          application:applications(*)
        )
      `)
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters.isHot) {
      query = query.eq('is_hot', true)
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        applications:product_applications(
          application:applications(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    
    // 增加浏览次数
    await supabase
      .from('products')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id)

    return data
  },

  // 分类相关
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  // 应用场景相关
  async getApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  // 询价相关
  async createInquiry(inquiryData) {
    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        ...inquiryData,
        user_id: supabase.auth.user()?.id
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  async getInquiries() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateInquiryStatus(id, status) {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // 案例相关
  async getCases(filters = {}) {
    let query = supabase
      .from('cases')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })

    if (filters.projectType) {
      query = query.eq('project_type', filters.projectType)
    }

    if (filters.isFeatured) {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // 认证相关
  async getCertifications() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('status', 'active')
      .eq('is_valid', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  }
}

// 认证相关
export const auth = {
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // 微信登录
  async signInWithWechat() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'wechat'
    })
    if (error) throw error
    return data
  }
}

// 文件上传
export const storage = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)

    if (error) throw error
    return data
  },

  async getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }
}

// 实时订阅
export const realtime = {
  subscribeToInquiries(callback) {
    return supabase
      .channel('inquiries')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'inquiries' },
        callback
      )
      .subscribe()
  },

  subscribeToProducts(callback) {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        callback
      )
      .subscribe()
  }
}
