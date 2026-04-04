import { createTheme } from '@mantine/core';

export const mantineTheme = createTheme({
    components: {
        TextInput: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        }
        ,
        Button :{
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        }
        ,
        NumberInput: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
        PasswordInput: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
        Textarea: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
        Select: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
        MultiSelect: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
        Autocomplete: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
        PinInput: {
            defaultProps: {
                size: 'lg',
                radius: 'md',
            },
        },
    },
});