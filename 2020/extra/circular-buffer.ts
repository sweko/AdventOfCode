type Node<T> = {
    data: T;
    next: Node<T>;
    prev: Node<T>;
}

export class CircularBuffer<T> {
    private data = new Map<T, Node<T>>();

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

        const len = input.length;
        if (len === 1) {
            first.prev = first;
            first.next = first;
        }

        let prev = first; 
        for (let index = 1; index < len; index += 1) {
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
    }

    remove(element: T) {
        const current = this.data.get(element);
        current.prev.next = current.next;
        current.next.prev = current.prev;

        this.data.delete(element);
    }

    removeAfter(element: T, count: number) {
        const current = this.data.get(element);
        const result: T[] = [];
        let active = current.next;
        for (let index = 0; index < count; index +=1) {
            result.push(active.data);
            this.data.delete(active.data);
            active = active.next;
        }
        active.prev = current;
        current.next = active;
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
        return this.data.size;
    }

}