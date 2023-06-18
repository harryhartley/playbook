import type { Play } from '@prisma/client'
import { Character, Environment, Speed, Stage, Type } from '@prisma/client'

export const validationValues = {
  name: {
    required: true,
    maxLength: 50,
  },
  videoEmbedUrl: {
    required: true,
    pattern: /^https:\/\/drive.google.com\/file\/d\/[a-z0-9_-]+\/preview|https:\/\/www.youtube.com\/embed\/[a-z0-9_-]{11}(\?clip=[a-z0-9_-]{36}&amp;clipt=[a-z0-9_-]+)?$/gi,
  },
  description: {
    required: true,
    maxLength: 300,
  },
}

const validateName = (name: string | undefined) => {
  if (!name) return false
  if (name.length > validationValues.name.maxLength) return false
  return true
}

const validateVideoEmbedUrl = (videoEmbedUrl: string | undefined) => {
  if (!videoEmbedUrl) return false
  if (!videoEmbedUrl.match(validationValues.videoEmbedUrl.pattern)) return false
  return true
}

const validateDescription = (description: string | undefined) => {
  if (!description) return false
  if (description.length > validationValues.description.maxLength) return false
  return true
}

const validateType = (type: Type) => {
  if (!Object.keys(Type).includes(type)) return false
  return true
}

const validateSpeed = (speed: Speed) => {
  if (!Object.keys(Speed).includes(speed)) return false
  return true
}

const validateEnvironment = (environment: Environment) => {
  if (!Object.keys(Environment).includes(environment)) return false
  return true
}

const validateCharacter = (character: Character) => {
  if (!Object.keys(Character).includes(character)) return false
  return true
}

const validateStage = (character: Stage) => {
  if (!Object.keys(Stage).includes(character)) return false
  return true
}

const validateDifficulty = (difficulty: number) => {
  if (![1, 2, 3, 4, 5].includes(difficulty)) return false
  return true
}

export const validatePlay = (play: Play) => {
  if (!validateName(play.name)) return false
  if (!validateVideoEmbedUrl(play.videoEmbedUrl)) return false
  if (!validateDescription(play.description)) return false
  if (!validateType(play.type)) return false
  if (!validateSpeed(play.speed)) return false
  if (!validateEnvironment(play.environment)) return false
  if (!validateCharacter(play.character)) return false
  if (!validateStage(play.stage)) return false
  if (!validateDifficulty(play.difficulty)) return false
  return true
}
