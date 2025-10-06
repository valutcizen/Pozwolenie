export default class QuestionRange {
  private indexes: Set<number>

  public constructor (start?: number, end?: number) {
    this.indexes = new Set<number>()
    if (start !== undefined && end !== undefined) {
      this.addRange(start, end)
    } else if (start !== undefined) {
      this.addIndex(start)
    }
  }

  public static fromString (rangeString: string): QuestionRange {
    const range = new QuestionRange()
    if (!rangeString) {
      return range
    }

    const parts = rangeString.split(/[\s,]+/)
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number)
        if (!Number.isNaN(start) && !Number.isNaN(end)) {
          if (start > end || start < 1 || end > 200) {
            continue
          }
          range.addRange(start - 1, end - 1)
        }
      } else {
        const index = Number(part)
        if (!Number.isNaN(index)) {
          if (index < 1 || index > 200) {
            continue
          }
          range.addIndex(index - 1)
        }
      }
    }
    return range
  }

  public toString (): string {
    if (this.indexes.size === 0) {
      return ''
    }

    const sortedIndexes = Array.from(this.indexes).sort((a, b) => a - b)
    const ranges: string[] = []
    if (sortedIndexes.length === 0) {
      return ''
    }

    let start = sortedIndexes[0]
    let end = sortedIndexes[0]

    for (let i = 1; i < sortedIndexes.length; i++) {
      if (sortedIndexes[i] === end + 1) {
        end = sortedIndexes[i]
      } else {
        if (start === end) {
          ranges.push((start + 1).toString())
        } else {
          ranges.push(`${start + 1}-${end + 1}`)
        }
        start = sortedIndexes[i]
        end = sortedIndexes[i]
      }
    }

    if (start === end) {
      ranges.push((start + 1).toString())
    } else {
      ranges.push(`${start + 1}-${end + 1}`)
    }

    return ranges.join(',')
  }

  public clear (): void {
    this.indexes.clear()
  }

  public addRange (start: number, end: number): void {
    for (let i = start; i <= end; i++) {
      this.indexes.add(i)
    }
  }

  public addIndex (index: number): void {
    this.indexes.add(index)
  }

  public addIndexes (indexes: number[]): void {
    for (const index of indexes) {
      this.indexes.add(index)
    }
  }

  public getQuestionIndexes (max: number): number[] {
    return Array.from(this.indexes)
      .filter(i => i >= 0 && i < max)
      .sort((a, b) => a - b)
  }
}
