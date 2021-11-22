export const selectToolStyles = {
    control: (provided, state) => ({
        ...provided,
        padding: '0 !important',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        minHeight: 'unset',
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#2d3748'
        }
        // '&:focus': {
        //     backgroundColor: '#2d3748'
        // }
    }),
    singleValue: (provided, { selectProps, data }) => ({
        ...provided,
        fontFamily: selectProps.fontFamily ? data.value : 'unset',
        fontWeight: selectProps.fontWeight ? data.value : 'normal',
        color: 'white'
    }),
    input: (provided, state) => ({
        border: 'none'
    }),
    indicatorSeparator: (provided, state) => ({
        display: 'none'
    }),
    indicatorsContainer: (provided, state) => ({
        padding: 'none'
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        padding: 'none'
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        padding: 'none',
        marginTop: '-1px'
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: '#444',
        border: '1px solid black'
    }),
    menuList: (provided, state) => ({
        ...provided,
        padding: 'none'
    }),
    option: (provided, state) => ({
        ...provided,
        padding: '1px 1px 1px 4px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflowX: 'hidden',
        backgroundColor: state.isSelected ? '#2684FF' : '#444',
        '&:hover': {
            backgroundColor: '#46a480'
        }
    })
}
