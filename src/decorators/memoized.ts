export function memoized<This, Return>(
    originalMethod: (this: This) => Return,
    context: ClassGetterDecoratorContext<This, Return>,
) {
    const methodName = context.name;

    context.addInitializer(function () {
        let cached: Return | undefined;

        Object.defineProperty(this, methodName, {
            get() {
                if (typeof cached === "undefined") {
                    cached = originalMethod.call(this);
                }

                return cached;
            },
        });
    });
}
