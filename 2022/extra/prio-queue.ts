// naive, non performant implementation
export class PriorityQueue<T> {
    private _items: { value: T, metric: number}[] = [];

    public get count() {
        return this._items.length;
    }

    public get items(){
        return this._items.map(item => item.value);
    }

    constructor(private metric: (value: T) => number, private reverse: boolean = false) { }

    public enqueue(...items: T[]) {
        for (const item of items) {
            this._items.push({value: item, metric: this.metric(item)});
        }
        this._items.sort((f, s)=> this.reverse ? s.metric - f.metric : f.metric - s.metric )
    }

    public dequeue() {
        return this._items.shift();
    }
}