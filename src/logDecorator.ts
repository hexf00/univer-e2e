export function logDecorator(originalMethod: any, descriptor: ClassMethodDecoratorContext) {
  return async function (this: any, ...args: any[]) {
    const start = Date.now()
    console.log(`begin ${descriptor.name.toString()}, params: ${JSON.stringify(args)}`)

    try {
      const result = await originalMethod.apply(this, args)
      const end = Date.now()
      console.log(`success ${descriptor.name.toString()}, time: ${end - start}ms, result: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      const end = Date.now()
      console.error(`error on ${descriptor.name.toString()}, time: ${end - start}ms, detail: ${error}`)
      throw error
    }
  }
}
