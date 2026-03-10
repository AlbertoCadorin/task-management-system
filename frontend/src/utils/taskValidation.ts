import type { CreateTaskDto } from '../types/task.types'

export const MAX_TITLE_LENGTH = 120
export const MAX_DESCRIPTION_LENGTH = 500

export type TaskFormErrors = {
    title?: string
    description?: string
    release_date?: string
}

export const isValidDateString = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false
    }

    const parsed = Date.parse(value)
    return !Number.isNaN(parsed)
}

export const validateTaskInput = (data: CreateTaskDto): TaskFormErrors => {
    const errors: TaskFormErrors = {}

    const title = data.title.trim()
    if (!title) {
        errors.title = 'Il titolo e obbligatorio'
    } else if (title.length > MAX_TITLE_LENGTH) {
        errors.title = `Il titolo non puo superare ${MAX_TITLE_LENGTH} caratteri`
    }

    const description = (data.description || '').trim()
    if (description.length > MAX_DESCRIPTION_LENGTH) {
        errors.description = `La descrizione non puo superare ${MAX_DESCRIPTION_LENGTH} caratteri`
    }

    if (data.release_date && !isValidDateString(data.release_date)) {
        errors.release_date = 'Data di rilascio non valida'
    }

    return errors
}
