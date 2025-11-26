
export function generateWhatsAppMessage(fixerName: string, service?: string, customMessage?: string): string {
  if (customMessage) return customMessage

  const base = `Hola ${fixerName}`
  const serviceText = service ? `, vi tu oferta de ${service.toLowerCase()}` : ", encontré tu perfil"
  const ending = " y me interesaría trabajar contigo."

  return base + serviceText + ending
}


export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 0) return phone

  
  if (cleaned.startsWith("591")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }

  
  return phone
}


export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 8 && cleaned.length <= 15
}


export function generateShareURL(baseURL: string, fixerName: string): string {
  const encodedName = encodeURIComponent(fixerName)
  return `${baseURL}?fixer=${encodedName}`
}
