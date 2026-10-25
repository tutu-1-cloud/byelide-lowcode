import type { Ref } from 'vue'

// 校验tag属性是否符合要求
export function validateTagProp(tag?: Ref) {
  if (tag) {
    if (typeof tag === 'string') return true
    if (typeof tag === 'object') {
      if (
        typeof (tag as any).value === 'string' ||
        typeof (tag as any).value === 'function' ||
        typeof (tag as any).value === 'object'
      ) {
        return true
      }
    }
    return false
  }
  return true
}

// 获取tag属性的props
// return { value: 'div', props: { class: 'my-list' } }
export function getTagProps(ctx: any, tagClass?: string) {
  const tag = ctx.$props.tag

  if (tag) {
    if (typeof tag === 'string') {
      const result: any = { value: tag }
      if (tagClass) {
        result.props = { class: tagClass }
      }
      return result
    }

    if (typeof tag === 'object') {
      const result = { value: tag.value || 'div', props: tag.props || {} }

      if (tagClass) {
        if (result.props.class) {
          if (Array.isArray(result.props.class)) {
            result.props.class.push(tagClass)
          } else {
            result.props.class = [tagClass, result.props.class]
          }
        } else {
          result.props.class = tagClass
        }
      }

      return result
    }
  }

  return { value: 'div' }
}