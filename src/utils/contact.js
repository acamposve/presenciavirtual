export const VALID_TOPICS = ['general', 'domain', 'hosting', 'web', 'ai']

export function resolveTopic(param) {
  const normalized = (param || '').toLowerCase().trim()
  return VALID_TOPICS.includes(normalized) ? normalized : 'general'
}
