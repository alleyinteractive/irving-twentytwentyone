import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import history from '@irvingjs/core/utils/history';
import useStandardProps from '@irvingjs/styled/hooks/useStandardProps';
import {
  standardPropTypes,
  getStandardDefaultProps,
} from '@irvingjs/styled/types/propTypes';
import {
  analyticsPropTypes,
  getAnalyticsDefaultProps,
} from '@irvingjs/styled/types/analyticsPropTypes';
import getTrackingService from '@irvingjs/core/services/trackingService';
import * as defaultStyles from './themes/default';

const trackingService = getTrackingService();

/**
 * Search input.
 *
 * Form with an input field for search.
 *
 * @tracking Fires when search form is submitted. Label is query.
 * - event          irving.searchSubmit
 * - eventComponent search
 * - eventData      {analytics.search}
 *
 */
const SearchForm = (props) => {
  const {
    analytics,
    baseUrl,
    searchTerm,
    searchTermQueryArg,
    theme,
  } = props;
  const standardProps = useStandardProps(props);
  const {
    SearchFormWrapper,
    SearchFormTerm,
    SearchFormSubmitButton,
    SearchLabel,
  } = theme;

  const defaultValues = {};
  defaultValues[searchTermQueryArg] = searchTerm;

  const { register, handleSubmit } = useForm({
    defaultValues,
  });
  const tracking = trackingService.useTracking();
  const trackSearch = (query) => {
    tracking.trackEvent({
      event: 'irving.searchSubmit',
      eventComponent: 'search',
      eventData: {
        ...analytics.search,
        label: query,
      },
    });
  };
  const onSubmit = (data, e) => {
    e.preventDefault();
    trackSearch(data[searchTermQueryArg]);
    const currentQueryVars = queryString.parse(window.location.search);
    currentQueryVars[searchTermQueryArg] = data[searchTermQueryArg];

    // eslint-disable-next-line max-len
    history.push(`${baseUrl}?${queryString.stringify(currentQueryVars)}`);
  };

  return (
    <SearchFormWrapper
      {...standardProps}
      action={baseUrl}
      onSubmit={handleSubmit(onSubmit)}
    >
      <SearchLabel for="search-form-1">Search…</SearchLabel>
      <SearchFormTerm
        aria-label="search"
        name={searchTermQueryArg}
        id="search-form-1"
        placeholder="Search"
        ref={register}
        type="search"
        className="search-field"
      />
      <SearchFormSubmitButton
        type="submit"
        className="search-submit"
        value="Search"
      />
    </SearchFormWrapper>
  );
};

SearchForm.defaultProps = {
  ...getAnalyticsDefaultProps(),
  ...getStandardDefaultProps(),
  theme: defaultStyles,
  baseUrl: '/',
  searchTerm: '',
  searchTermQueryArg: 'search',
};

SearchForm.propTypes = {
  ...analyticsPropTypes,
  ...standardPropTypes,
  /**
   * Base url for search.
   */
  baseUrl: PropTypes.string,
  /**
   * The string being searched for.
   */
  searchTerm: PropTypes.string,
  /**
   * The query var used for the search term.
   */
  searchTermQueryArg: PropTypes.string,
};

const themeMap = {
  default: defaultStyles,
};

export {
  SearchForm as Component,
  themeMap,
};

export default SearchForm;
