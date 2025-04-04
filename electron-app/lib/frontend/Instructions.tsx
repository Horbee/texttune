import { Box, List, Stack, ThemeIcon, Title, Transition } from "@mantine/core";
import { FaCheck, FaTimesCircle } from "react-icons/fa";

export const Instructions = ({ readyToFix }: { readyToFix: boolean }) => {
  return (
    <Stack gap="sm">
      <Title order={2}>How to use</Title>

      <List size="lg" withPadding icon={<Icon completed={readyToFix} />}>
        <List.Item pos="relative" pl={20}>
          <b>F9</b> to fix current line
        </List.Item>
        <List.Item pos="relative" pl={20}>
          <b>F10</b> to fix selection
        </List.Item>
      </List>
    </Stack>
  );
};

const Icon = ({ completed }: { completed: boolean }) => {
  return (
    <Box>
      <Transition
        mounted={completed}
        transition="fade-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Box style={styles} pos="absolute" top={8} left={0}>
            <ThemeIcon color="teal" size={24} radius="xl">
              <FaCheck size={16} />
            </ThemeIcon>
          </Box>
        )}
      </Transition>

      <Transition
        mounted={!completed}
        transition="fade-up"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Box style={styles} pos="absolute" top={8} left={0}>
            <ThemeIcon color="red" size={24} radius="xl">
              <FaTimesCircle size={16} />
            </ThemeIcon>
          </Box>
        )}
      </Transition>
    </Box>
  );
};
