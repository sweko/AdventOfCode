import { nextTick } from "process";

type Node<T> = {
    data: T;
    next: Node<T>;
    prev: Node<T>;
}

export class CircularBuffer<T> {
    private data = new Map<T, Node<T>>();

    constructor(input: T[]) {
        if (input.length === 0) {
            return;
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
    }

    toArray() {
        const first = this.data.keys().next().value;
        if (first === undefined) {
            return [];
        }
        const result = [first];
        let current = this.data.get(first).next;

        while (current.data !== first) {
            result.push(current.data);
            current = current.next;
        }
        return result as T[];
    }

    addAfter(target: T, element: T) {
        const existing = this.data.get(target);
        const item = {
            data: element,
            next: existing.next,
            prev: existing
        };
        existing.next = item;
        this.data.set(element, item);
    }

    remove(element: T) {
        const current = this.data.get(element);
        current.prev.next = current.next;
        current.next.prev = current.prev;

        this.data.delete(element);
    }

}