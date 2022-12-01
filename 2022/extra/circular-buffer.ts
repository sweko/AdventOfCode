type Node<T> = {
    data: T;
    next: Node<T>;
    prev: Node<T>;
}

export class CircularBuffer<T> {
    private data = new Map<T, Node<T>>();
    private _size: number;

    constructor(input: T[]) {
        if (input.length === 0) {
            throw Error("Must initiate circular buffer with at least one element");
        }

        const first = {
            data: input[0],
            prev: null,
            next: null
        };
        this.data.set(input[0], first);

        this._size = input.length;
        if (this._size === 1) {
            first.prev = first;
            first.next = first;
        }

        let prev = first; 
        for (let index = 1; index < this._size; index += 1) {
            const element = input[index]
            const item = {
                data: element,
                prev,
                next: null
            }
            prev.next = item;
            prev = item;
            this.data.set(element, item)
        }

        prev.next = first;
        first.prev = prev;
    }

    toArray(from : T = this.data.keys().next().value) {

        if (from === undefined) {
            return [];
        }
        const result = [from];
        let current = this.data.get(from).next;

        while (current.data !== from) {
            result.push(current.data);
            current = current.next;
        }
        return result as T[];
    }

    addAfter(target: T, ...elements: T[]) {
        let index = 0;
        let current = this.data.get(target);

        while (index < elements.length) {
            const element = elements[index];
            const item = {
                data: element,
                prev: null, //current,
                next: current.next,
            };
            current.next = item;
            this.data.set(element, item);
            current = item;
            index += 1;
        }

        this._size += elements.length;
    }

    remove(element: T) {
        const current = this.data.get(element);
        current.prev.next = current.next;
        current.next.prev = current.prev;

        this.data.delete(element);
        this._size -= 1;
    }

    removeAfter(element: T, count: number) {
        const current = this.data.get(element);
        const result: T[] = [];
        let active = current.next;
        for (let index = 0; index < count; index +=1) {
            result.push(active.data);
            // no need to actually delete the data
            // this.data.delete(active.data);
            active = active.next;
        }
        active.prev = current;
        current.next = active;
        this._size -= count;
        return result;
    }

    next(element: T) {
        const current = this.data.get(element);
        return current.next.data;
    }

    previous(element: T) {
        const current = this.data.get(element);
        return current.prev.data;
    }

    size() {
        return this._size;
    }

}