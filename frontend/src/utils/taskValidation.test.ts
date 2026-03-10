import { describe, expect, it } from 'vitest'
import { validateTaskInput } from './taskValidation'

describe('validateTaskInput', () => {
    it('returns title error when title is empty', () => {
        const result = validateTaskInput({
            title: '   ',
            description: 'desc',
            priority: 'medium',
            status: 'todo',
            release_date: undefined,
        })

        expect(result.title).toBe('Il titolo e obbligatorio')
    })

    it('returns release date error for invalid date', () => {
        const result = validateTaskInput({
            title: 'Task valida',
            description: 'desc',
            priority: 'medium',
            status: 'todo',
            release_date: '2026-99-99',
        })

        expect(result.release_date).toBe('Data di rilascio non valida')
    })

    it('returns no errors for valid input', () => {
        const result = validateTaskInput({
            title: 'Preparare demo',
            description: 'Descrizione valida',
            priority: 'high',
            status: 'in_progress',
            release_date: '2026-03-10',
        })

        expect(result).toEqual({})
    })
})
