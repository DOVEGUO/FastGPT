import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Box, Card, Flex, useTheme, useOutsideClick, Button } from '@chakra-ui/react';
import { addDays, format } from 'date-fns';
import { type DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import zhCN from 'date-fns/locale/zh-CN';
import { useTranslation } from 'next-i18next';
import MyIcon from '../Icon';

const DateRangePicker = ({
  onChange,
  onSuccess,
  position = 'bottom',
  defaultDate = {
    from: addDays(new Date(), -30),
    to: new Date()
  },
  dateRange
}: {
  onChange?: (date: DateRange) => void;
  onSuccess?: (date: DateRange) => void;
  position?: 'bottom' | 'top';
  defaultDate?: DateRange;
  dateRange?: DateRange;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const OutRangeRef = useRef(null);
  const [range, setRange] = useState<DateRange | undefined>(defaultDate);
  const [showSelected, setShowSelected] = useState(false);

  useEffect(() => {
    if (dateRange) {
      setRange(dateRange);
    }
  }, [dateRange]);

  const formatSelected = useMemo(() => {
    if (range?.from && range.to) {
      return `${format(range.from, 'y-MM-dd')} ~ ${format(range.to, 'y-MM-dd')}`;
    }
    return `${format(new Date(), 'y-MM-dd')} ~ ${format(new Date(), 'y-MM-dd')}`;
  }, [range]);

  useOutsideClick({
    ref: OutRangeRef,
    handler: () => {
      setShowSelected(false);
    }
  });

  return (
    <Box position={'relative'} ref={OutRangeRef}>
      <Flex
        border={theme.borders.base}
        px={3}
        py={1}
        borderRadius={'sm'}
        cursor={'pointer'}
        bg={'myGray.50'}
        fontSize={'sm'}
        onClick={() => setShowSelected(true)}
      >
        <Box color={'myGray.600'} fontWeight={'400'}>
          {formatSelected}
        </Box>
        <MyIcon ml={2} name={'date'} w={'16px'} color={'myGray.600'} />
      </Flex>
      {showSelected && (
        <Card
          position={'absolute'}
          zIndex={1}
          css={{
            '--rdp-background-color': '#d6e8ff',
            ' --rdp-accent-color': '#0000ff'
          }}
          {...(position === 'top'
            ? {
                bottom: '40px'
              }
            : {})}
        >
          <DayPicker
            locale={zhCN}
            id="test"
            mode="range"
            defaultMonth={defaultDate.to}
            selected={range}
            disabled={[
              { from: new Date(2022, 3, 1), to: addDays(new Date(), -90) },
              { from: addDays(new Date(), 1), to: new Date(2099, 1, 1) }
            ]}
            onSelect={(date) => {
              if (date?.from === undefined) {
                date = {
                  from: range?.from,
                  to: range?.from
                };
              }
              if (date?.to === undefined) {
                date.to = date.from;
              }

              if (date?.from) {
                date.from = new Date(date.from.setHours(0, 0, 0, 0));
              }
              if (date?.to) {
                date.to = new Date(date.to.setHours(23, 59, 59, 999));
              }
              setRange(date);
              onChange?.(date);
            }}
            footer={
              <Flex justifyContent={'flex-end'}>
                <Button
                  variant={'outline'}
                  size={'sm'}
                  mr={2}
                  onClick={() => setShowSelected(false)}
                >
                  {t('common:Close')}
                </Button>
                <Button
                  size={'sm'}
                  onClick={() => {
                    onSuccess?.(range || defaultDate);
                    setShowSelected(false);
                  }}
                >
                  {t('common:Confirm')}
                </Button>
              </Flex>
            }
          />
        </Card>
      )}
    </Box>
  );
};

export default DateRangePicker;
export type DateRangeType = DateRange;
