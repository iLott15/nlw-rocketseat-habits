import { useNavigation, useFocusEffect } from '@react-navigation/native'
import dayjs from 'dayjs'
import React, { useCallback, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'

import HabitDay from '../../components/HabitDay'
import Header from '../../components/Header'
import { Loading } from '../../components/Loading'
import { api } from '../../lib/axios'

import { DAY_SIZE, WEEK_DAYS } from '../../utils/constants'
import { generateDatesFromYearBeginning } from '../../utils/generate-dates-from-year-beginning'

const datesFromYearStart = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSize - WEEK_DAYS.length
export interface ISummary {
  id: string
  date: string
  completed: number
  amount: number
}

function HomeScreen() {
  const { navigate } = useNavigation()

  const [summary, setSummary] = useState<ISummary[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const res = await api.get<ISummary[]>('/summary')
      setSummary(res.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchSummary()
    }, [])
  )

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 px-8 pt-16 bg-dark">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {WEEK_DAYS.map((weekDay, index) => {
          return (
            <Text
              key={`${weekDay}-${index}`}
              className="mx-1 text-xl font-bold text-center text-zinc-400"
              style={{ width: DAY_SIZE }}>
              {weekDay}
            </Text>
          )
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, 'day')
            })

            return (
              <HabitDay
                onPress={() =>
                  navigate('habit', {
                    date: date.toISOString(),
                    amount: dayInSummary?.amount,
                    defaultCompleted: dayInSummary?.completed
                  })
                }
                key={date.toISOString()}
                date={date}
                amount={dayInSummary?.amount}
                completed={dayInSummary?.completed}
              />
            )
          })}
          {Array.from({ length: amountOfDaysToFill }).map((_, index) => {
            return <HabitDay key={index} future />
          })}
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen
