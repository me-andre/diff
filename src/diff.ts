type OperationDefinition<T extends string, A extends {} = {}> = A & {
    type: T;
    index: number;
}

type Addition = OperationDefinition<'insert', { value: number }>;
type Deletion = OperationDefinition<'delete'>;

type Operation = Addition | Deletion;

// Depending on how much source is close to result, the algorithm's efficiency varies from O(n) in case if high similarity
// to O(n*m)~O(n^2) in case of totally different lists.
// There's possibility to limit backtrackStep to a certain value - that would allow to balance between performance and
// size of the operations list in worst case scenarios.
export const diff = (source: number[], result: number[]): Operation[] => {
    const ops: Operation[] = [];

    const remove = (sourceIndex: number, count = 1) => {
        for (let i = 0; i < count; i++) {
            ops.push({
                type: 'delete',
                index: sourceIndex + i
            });
        }
    };

    const insert = (sourceIndex: number, resultIndex: number, count = 1) => {
        for (let i = 0; i < count; i++) {
            ops.push({
                type: 'insert',
                index: sourceIndex + i,
                value: result[resultIndex + i]
            });
        }
    };

    // Mismatch distance is how far behind the cursors an inequality occurred: source[cursor] != result[cursor]
    let mismatchDistance = 0;

    // Source and result cursors are kept independently, but they always advance through the cycle
    for (let sourceIndex = 0, resultIndex = 0; true; sourceIndex++, resultIndex++) {
        const mismatchStartSourceIndex = sourceIndex - mismatchDistance;
        const mismatchStartResultIndex = resultIndex - mismatchDistance;

        if (sourceIndex >= source.length && resultIndex >= result.length) {
            remove(mismatchStartSourceIndex, source.length - mismatchStartSourceIndex);
            insert(mismatchStartSourceIndex, mismatchStartResultIndex, result.length - mismatchStartResultIndex);
            break;
        }

        let backtrackStep = 0;

        // Racing between cursors on source and result, to find the "snake" (start of a common subsequence),
        // from the current position to the start of mismatch.
        // A normal comparison between source and result at cursors is an edge case
        // that happens when mismatchDistance = 0.
        for (backtrackStep = 0; backtrackStep <= mismatchDistance; backtrackStep++) {
            if (sourceIndex < source.length && source[sourceIndex] === result[mismatchStartResultIndex + backtrackStep]) {
                // A snake is found from the current source[cursor], so we rewind the result[cursor]
                // in order to proceed from the snake start and keep minimal changes.
                resultIndex = mismatchStartResultIndex + backtrackStep;

                remove(mismatchStartSourceIndex, sourceIndex - mismatchStartSourceIndex);
                insert(mismatchStartSourceIndex, mismatchStartResultIndex, backtrackStep);

                mismatchDistance = -1;

                break;
            }

            if (resultIndex < result.length && result[resultIndex] === source[mismatchStartSourceIndex + backtrackStep]) {
                // A snake is found from the current result[cursor], so we rewind the source[cursor]
                // in order to proceed from the snake start and keep minimal changes.
                sourceIndex = mismatchStartSourceIndex + backtrackStep;

                remove(mismatchStartSourceIndex, backtrackStep);
                insert(mismatchStartSourceIndex, mismatchStartResultIndex, resultIndex - mismatchStartResultIndex);

                mismatchDistance = -1;

                break;
            }
        }

        mismatchDistance++;
    }

    return ops;
};