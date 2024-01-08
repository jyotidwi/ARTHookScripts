export class JSHandle implements SizeOfClass {

    public handle: NativePointer

    constructor(handle: NativePointer | number) {
        this.handle = (typeof handle === "number") ? ptr(handle) : handle
    }

    get CurrentHandle(): NativePointer {
        return this.handle
    }

    get SizeOfClass(): number {
        return 0
    }

    get VirtualClassOffset(): number {
        return 0
    }

    get VirtualTableList(): NativePointer[] {
        if (this.VirtualClassOffset === Process.pointerSize) {
            const vtable = this.handle.readPointer()
            const vtableList: NativePointer[] = []
            let i = 0
            while (true) {
                const vtableItem = vtable.add(i * Process.pointerSize).readPointer()
                if (vtableItem.isNull()) break
                vtableList.push(vtableItem)
                i++
            }
            return vtableList
        }
        return []
    }

    public VirtualTablePrint(): void {
        this.VirtualTableList.map((item, index) => `[${index}] ${item}`).forEach(LOGD)
    }

    show(): void {
        LOGD(this.toString())
    }

    toString(): string {
        let disp: string = `JSHandle< ${this.handle} >`
        return disp
    }
}