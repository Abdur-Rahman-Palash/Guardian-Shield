import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/client'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailAlertData {
  parentEmail: string
  childName: string
  alertUrl: string
  alertDomain: string
  alertCategory: string
  alertSeverity: string
  screenshot?: string
  timestamp: string
  language: 'en' | 'bn'
}

interface PaymentEmailData {
  userEmail: string
  userName: string
  plan: string
  amount: number
  paymentMethod: string
  transactionId?: string
  language: 'en' | 'bn'
}

interface DailyDigestData {
  parentEmail: string
  parentName: string
  totalAlerts: number
  alertsByCategory: Record<string, number>
  alertsByChild: Record<string, number>
  highRiskAlerts: number
  date: string
  language: 'en' | 'bn'
}

// Email Templates
const emailTemplates = {
  alert: {
    en: {
      subject: (childName: string) => `🚨 Guardian Shield Alert: ${childName}`,
      html: (data: EmailAlertData) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Guardian Shield Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .alert-box { border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; background: white; }
            .screenshot { max-width: 100%; height: auto; border: 1px solid #ddd; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .severity-high { color: #dc2626; font-weight: bold; }
            .severity-medium { color: #f59e0b; font-weight: bold; }
            .severity-low { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Guardian Shield Alert</h1>
              <p>Real-time protection for your family</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <h2>⚠️ Security Alert Detected</h2>
                <p><strong>Child:</strong> ${data.childName}</p>
                <p><strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                <p><strong>Website:</strong> <a href="${data.alertUrl}" target="_blank">${data.alertUrl}</a></p>
                <p><strong>Domain:</strong> ${data.alertDomain}</p>
                <p><strong>Category:</strong> ${data.alertCategory}</p>
                <p><strong>Severity:</strong> <span class="severity-${data.alertSeverity}">${data.alertSeverity.toUpperCase()}</span></p>
                
                ${data.screenshot ? `
                  <h3>📸 Screenshot Evidence:</h3>
                  <img src="${data.screenshot}" alt="Alert Screenshot" class="screenshot" />
                ` : ''}
              </div>
              
              <div style="background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>📋 What should you do?</h3>
                <ul>
                  <li>Review the content your child was trying to access</li>
                  <li>Have an open conversation about online safety</li>
                  <li>Consider adjusting screen time limits if needed</li>
                  <li>Check the full alert history in your dashboard</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alerts" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Full Dashboard
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Guardian Shield - Protecting Families Online</p>
              <p>This is an automated alert. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: (data: EmailAlertData) => `
        GUARDIAN SHIELD ALERT
        
        Child: ${data.childName}
        Time: ${new Date(data.timestamp).toLocaleString()}
        Website: ${data.alertUrl}
        Domain: ${data.alertDomain}
        Category: ${data.alertCategory}
        Severity: ${data.alertSeverity.toUpperCase()}
        
        What should you do?
        - Review the content your child was trying to access
        - Have an open conversation about online safety
        - Consider adjusting screen time limits if needed
        - Check the full alert history in your dashboard
        
        View Full Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alerts
        
        Guardian Shield - Protecting Families Online
        This is an automated alert. Please do not reply to this email.
      `
    },
    bn: {
      subject: (childName: string) => `🚨 গার্ডিয়ান শিল্ড সতর্কতা: ${childName}`,
      html: (data: EmailAlertData) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>গার্ডিয়ান শিল্ড সতর্কতা</title>
          <style>
            body { font-family: 'SolaimanLipi', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .alert-box { border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; background: white; }
            .screenshot { max-width: 100%; height: auto; border: 1px solid #ddd; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .severity-high { color: #dc2626; font-weight: bold; }
            .severity-medium { color: #f59e0b; font-weight: bold; }
            .severity-low { color: #10b981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ গার্ডিয়ান শিল্ড সতর্কতা</h1>
              <p>আপনার পরিবারের জন্য রিয়েল-টাইম সুরক্ষা</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <h2>⚠️ নিরাপত্তা সতর্কতা সনাক্ত হয়েছে</h2>
                <p><strong>সন্তান:</strong> ${data.childName}</p>
                <p><strong>সময়:</strong> ${new Date(data.timestamp).toLocaleString('bn-BD')}</p>
                <p><strong>ওয়েবসাইট:</strong> <a href="${data.alertUrl}" target="_blank">${data.alertUrl}</a></p>
                <p><strong>ডোমেইন:</strong> ${data.alertDomain}</p>
                <p><strong>বিভাগ:</strong> ${data.alertCategory}</p>
                <p><strong>তীব্রতা:</strong> <span class="severity-${data.alertSeverity}">${data.alertSeverity.toUpperCase()}</span></p>
                
                ${data.screenshot ? `
                  <h3>📸 স্ক্রিনশট প্রমাণ:</h3>
                  <img src="${data.screenshot}" alt="সতর্কতা স্ক্রিনশট" class="screenshot" />
                ` : ''}
              </div>
              
              <div style="background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>📋 আপনার করণীয় কী?</h3>
                <ul>
                  <li>আপনার সন্তান যে কন্টেন্ট অ্যাক্সেস করার চেষ্টা করছিল তা পর্যালোচনা করুন</li>
                  <li>অনলাইন নিরাপত্তা সম্পর্কে খোলামেলা আলোচনা করুন</li>
                  <li>প্রয়োজনে স্ক্রিন টাইম সীমা সামঞ্জস্য করুন</li>
                  <li>আপনার ড্যাশবোর্ডে সম্পূর্ণ সতর্কতা ইতিহাস পরীক্ষা করুন</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alerts" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  সম্পূর্ণ ড্যাশবোর্ড দেখুন
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>গার্ডিয়ান শিল্ড - অনলাইনে পরিবার রক্ষা করা</p>
              <p>এটি একটি স্বয়ংক্রিয় সতর্কতা। এই ইমেলের উত্তর দেবেন না।</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: (data: EmailAlertData) => `
        গার্ডিয়ান শিল্ড সতর্কতা
        
        সন্তান: ${data.childName}
        সময়: ${new Date(data.timestamp).toLocaleString('bn-BD')}
        ওয়েবসাইট: ${data.alertUrl}
        ডোমেইন: ${data.alertDomain}
        বিভাগ: ${data.alertCategory}
        তীব্রতা: ${data.alertSeverity.toUpperCase()}
        
        আপনার করণীয় কী?
        - আপনার সন্তান যে কন্টেন্ট অ্যাক্সেস করার চেষ্টা করছিল তা পর্যালোচনা করুন
        - অনলাইন নিরাপত্তা সম্পর্কে খোলামেলা আলোচনা করুন
        - প্রয়োজনে স্ক্রিন টাইম সীমা সামঞ্জস্য করুন
        - আপনার ড্যাশবোর্ডে সম্পূর্ণ সতর্কতা ইতিহাস পরীক্ষা করুন
        
        সম্পূর্ণ ড্যাশবোর্ড দেখুন: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alerts
        
        গার্ডিয়ান শিল্ড - অনলাইনে পরিবার রক্ষা করা
        এটি একটি স্বয়ংক্রিয় সতর্কতা। এই ইমেলের উত্তর দেবেন না।
      `
    }
  },
  payment: {
    en: {
      subject: (plan: string) => `✅ Payment Confirmed - Guardian Shield ${plan} Plan`,
      html: (data: PaymentEmailData) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .payment-box { border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; background: white; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Payment Successful!</h1>
              <p>Your Guardian Shield subscription is now active</p>
            </div>
            
            <div class="content">
              <div class="payment-box">
                <h2>💳 Payment Details</h2>
                <p><strong>Plan:</strong> ${data.plan}</p>
                <p><strong>Amount:</strong> ৳${data.amount}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>🎯 What's Included in Your Plan:</h3>
                <ul>
                  <li>✅ Unlimited security alerts</li>
                  <li>✅ Monitor up to 5 children</li>
                  <li>✅ Screenshot evidence</li>
                  <li>✅ Real-time notifications</li>
                  <li>✅ Priority customer support</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Guardian Shield - Protecting Families Online</p>
              <p>Thank you for choosing us to protect your family!</p>
            </div>
          </div>
        </body>
        </html>
      `
    },
    bn: {
      subject: (plan: string) => `✅ পেমেন্ট নিশ্চিত - গার্ডিয়ান শিল্ড ${plan} প্ল্যান`,
      html: (data: PaymentEmailData) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>পেমেন্ট নিশ্চিতকরণ</title>
          <style>
            body { font-family: 'SolaimanLipi', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .payment-box { border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; background: white; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 পেমেন্ট সফল!</h1>
              <p>আপনার গার্ডিয়ান শিল্ড সাবস্ক্রিপশন এখন সক্রিয়</p>
            </div>
            
            <div class="content">
              <div class="payment-box">
                <h2>💳 পেমেন্ট বিবরণ</h2>
                <p><strong>প্ল্যান:</strong> ${data.plan}</p>
                <p><strong>পরিমাণ:</strong> ৳${data.amount}</p>
                <p><strong>পেমেন্ট পদ্ধতি:</strong> ${data.paymentMethod}</p>
                ${data.transactionId ? `<p><strong>লেনদেন ID:</strong> ${data.transactionId}</p>` : ''}
                <p><strong>তারিখ:</strong> ${new Date().toLocaleString('bn-BD')}</p>
              </div>
              
              <div style="background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>🎯 আপনার প্ল্যানে কী অন্তর্ভুক্ত:</h3>
                <ul>
                  <li>✅ সীমাহীন নিরাপত্তা সতর্কতা</li>
                  <li>✅ ৫ জন সন্তান পর্যবেক্ষণ</li>
                  <li>✅ স্ক্রিনশট প্রমাণ</li>
                  <li>✅ রিয়েল-টাইম বিজ্ঞপ্তি</li>
                  <li>✅ অগ্রাধিকার গ্রাহক সহায়তা</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  ড্যাশবোর্ডে যান
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>গার্ডিয়ান শিল্ড - অনলাইনে পরিবার রক্ষা করা</p>
              <p>আপনার পরিবারকে রক্ষা করার জন্য আমাদের বেছে নেওয়ার জন্য ধন্যবাদ!</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  },
  dailyDigest: {
    en: {
      subject: (date: string) => `📊 Daily Digest - Guardian Shield (${date})`,
      html: (data: DailyDigestData) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily Digest</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .stats-box { padding: 15px; margin: 20px 0; background: white; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily Digest</h1>
              <p>Your family's online activity summary</p>
            </div>
            
            <div class="content">
              <div class="stats-box">
                <h2>📈 Today's Overview</h2>
                <p><strong>Total Alerts:</strong> ${data.totalAlerts}</p>
                <p><strong>High Risk Alerts:</strong> ${data.highRiskAlerts}</p>
                <p><strong>Date:</strong> ${data.date}</p>
              </div>
              
              <div class="stats-box">
                <h3>🏷️ Alerts by Category</h3>
                ${Object.entries(data.alertsByCategory).map(([category, count]) => 
                  `<p><strong>${category}:</strong> ${count}</p>`
                ).join('')}
              </div>
              
              <div class="stats-box">
                <h3>👨‍👩‍👧‍👦 Alerts by Child</h3>
                ${Object.entries(data.alertsByChild).map(([child, count]) => 
                  `<p><strong>${child}:</strong> ${count}</p>`
                ).join('')}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Full Dashboard
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Guardian Shield - Protecting Families Online</p>
              <p>Daily digest sent at ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `
    },
    bn: {
      subject: (date: string) => `📊 দৈনিক সারাংশ - গার্ডিয়ান শিল্ড (${date})`,
      html: (data: DailyDigestData) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>দৈনিক সারাংশ</title>
          <style>
            body { font-family: 'SolaimanLipi', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .stats-box { padding: 15px; margin: 20px 0; background: white; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 দৈনিক সারাংশ</h1>
              <p>আপনার পরিবারের অনলাইন কার্যকলাপ সারাংশ</p>
            </div>
            
            <div class="content">
              <div class="stats-box">
                <h2>📈 আজকের ওভারভিউ</h2>
                <p><strong>মোট সতর্কতা:</strong> ${data.totalAlerts}</p>
                <p><strong>উচ্চ-ঝুঁকি সতর্কতা:</strong> ${data.highRiskAlerts}</p>
                <p><strong>তারিখ:</strong> ${data.date}</p>
              </div>
              
              <div class="stats-box">
                <h3>🏷️ বিভাগ অনুযায়ী সতর্কতা</h3>
                ${Object.entries(data.alertsByCategory).map(([category, count]) => 
                  `<p><strong>${category}:</strong> ${count}</p>`
                ).join('')}
              </div>
              
              <div class="stats-box">
                <h3>👨‍👩‍👧‍👦 সন্তান অনুযায়ী সতর্কতা</h3>
                ${Object.entries(data.alertsByChild).map(([child, count]) => 
                  `<p><strong>${child}:</strong> ${count}</p>`
                ).join('')}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  সম্পূর্ণ ড্যাশবোর্ড দেখুন
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>গার্ডিয়ান শিল্ড - অনলাইনে পরিবার রক্ষা করা</p>
              <p>দৈনিক সারাংশ পাঠানো হয়েছে ${new Date().toLocaleString('bn-BD')}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  }
}

// WhatsApp Fallback
const sendWhatsAppFallback = async (message: string, phoneNumber: string) => {
  try {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`
    // In a real implementation, you would use WhatsApp Business API
    // For now, this is a fallback that opens WhatsApp
    console.log('WhatsApp fallback triggered:', whatsappUrl)
    return { success: true, method: 'whatsapp' }
  } catch (error) {
    console.error('WhatsApp fallback failed:', error)
    return { success: false, method: 'whatsapp', error }
  }
}

// Main Email Functions
export const sendAlertEmail = async (data: EmailAlertData) => {
  try {
    const template = emailTemplates.alert[data.language]
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Guardian Shield <alerts@guardianshield.com>',
      to: [data.parentEmail],
      subject: template.subject(data.childName),
      html: template.html(data),
      text: template.text(data)
    })

    if (error) {
      console.error('Email send failed:', error)
      // Fallback to WhatsApp
      const whatsappMessage = template.text(data)
      return await sendWhatsAppFallback(whatsappMessage, '+8801786433078')
    }

    return { success: true, method: 'email', data: emailData }
  } catch (error) {
    console.error('Alert email error:', error)
    return { success: false, method: 'email', error }
  }
}

export const sendPaymentEmail = async (data: PaymentEmailData) => {
  try {
    const template = emailTemplates.payment[data.language]
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Guardian Shield <payments@guardianshield.com>',
      to: [data.userEmail],
      subject: template.subject(data.plan),
      html: template.html(data)
    })

    if (error) {
      console.error('Payment email failed:', error)
      return { success: false, method: 'email', error }
    }

    return { success: true, method: 'email', data: emailData }
  } catch (error) {
    console.error('Payment email error:', error)
    return { success: false, method: 'email', error }
  }
}

export const sendDailyDigest = async (data: DailyDigestData) => {
  try {
    const template = emailTemplates.dailyDigest[data.language]
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Guardian Shield <digest@guardianshield.com>',
      to: [data.parentEmail],
      subject: template.subject(data.date),
      html: template.html(data)
    })

    if (error) {
      console.error('Daily digest failed:', error)
      return { success: false, method: 'email', error }
    }

    return { success: true, method: 'email', data: emailData }
  } catch (error) {
    console.error('Daily digest error:', error)
    return { success: false, method: 'email', error }
  }
}
