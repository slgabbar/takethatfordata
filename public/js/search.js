/* global instantsearch */

app({
  appId: 'CPXKNGPIA3',
  apiKey: '5c48ad9a063387024679616778114894',
  indexName: 'team_players',
  searchParameters: {
    hitsPerPage: 10,
  },
});

function app(opts) {
  const search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true,
  searchFunction: function(helper) {
    var searchResults = $('.search-results');
    if (helper.state.query === '') {
      searchResults.hide();
      return;
    }
    helper.search();
    searchResults.show();
  }

  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for team or player',
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
    })
  );

 
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    })
  );


  search.start();
}

function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeader(title) {
  return `<h5>${title}</h5>`;
}