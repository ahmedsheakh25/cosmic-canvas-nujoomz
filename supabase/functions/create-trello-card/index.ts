
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { briefId, briefData } = await req.json()
    
    const trelloApiKey = Deno.env.get('TRELLO_API_KEY')
    const trelloToken = Deno.env.get('TRELLO_TOKEN')
    const trelloListId = Deno.env.get('TRELLO_LIST_ID')

    if (!trelloApiKey || !trelloToken || !trelloListId) {
      throw new Error('Trello credentials not configured')
    }

    const isArabic = briefData.language === 'ar'
    const cardName = `${isArabic ? 'مشروع جديد:' : 'New Project:'} ${briefData.service} - ${briefId.slice(0, 8)}`
    
    const cardDescription = `
${isArabic ? 'موجز مشروع جديد من نجموز' : 'New project brief from Nujmooz'} 👽

${isArabic ? 'الخدمة:' : 'Service:'} ${briefData.service}
${isArabic ? 'اللغة:' : 'Language:'} ${briefData.language}
${isArabic ? 'تاريخ الإنشاء:' : 'Created:'} ${briefData.created_at}

${isArabic ? 'التفاصيل:' : 'Details:'}
${Object.entries(briefData.answers).map(([key, value]) => `• ${value}`).join('\n')}

${isArabic ? 'معلومات العميل:' : 'Client Info:'}
${briefData.client_info.name ? `${isArabic ? 'الاسم:' : 'Name:'} ${briefData.client_info.name}` : ''}
${briefData.client_info.email ? `${isArabic ? 'البريد:' : 'Email:'} ${briefData.client_info.email}` : ''}
${briefData.client_info.phone ? `${isArabic ? 'الهاتف:' : 'Phone:'} ${briefData.client_info.phone}` : ''}

Brief ID: ${briefId}
    `.trim()

    const trelloUrl = `https://api.trello.com/1/cards?key=${trelloApiKey}&token=${trelloToken}`
    
    const response = await fetch(trelloUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cardName,
        desc: cardDescription,
        idList: trelloListId,
        pos: 'top'
      })
    })

    if (!response.ok) {
      throw new Error(`Trello API error: ${response.status}`)
    }

    const trelloCard = await response.json()

    return new Response(JSON.stringify({ 
      success: true, 
      cardId: trelloCard.id,
      cardUrl: trelloCard.url 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error creating Trello card:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
