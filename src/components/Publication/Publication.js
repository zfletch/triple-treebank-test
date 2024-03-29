import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { chunksType, publicationMatchType, locationType } from '../../lib/types';

import styles from './Publication.module.css';

import Header from '../Header';
import ArethusaWrapper from '../ArethusaWrapper';
import Treebank from '../Treebank';
import Markdown from '../Markdown';

const renderText = (text) => {
  if (Array.isArray(text)) {
    return (
      <div>
        {text.map((t) => (
          <span key={t}>
            {t}
            <br />
          </span>
        ))}
      </div>
    );
  }

  return text;
};

const renderRow = (title, text) => (
  <tr>
    <th scope="col">{title}</th>
    <td className={styles.publicationRow}>
      {renderText(text)}
    </td>
  </tr>
);

const renderLinkRow = (title, link) => (
  <tr>
    <th scope="col">{title}</th>
    <td>
      <a href={link}>{link}</a>
    </td>
  </tr>
);

const renderMarkdownRow = (title, markdown) => (
  <tr>
    <th scope="col">{title}</th>
    <td className={styles.publicationRow}>
      <Markdown source={markdown} />
    </td>
  </tr>
);

const renderLocusRow = (title, text, publicationPath) => (
  <tr>
    <th scope="col">{title}</th>
    <td className={styles.publicationRow}>
      {text}
      {' '}
      <a href={`../${publicationPath}`}>
        (See all)
      </a>
    </td>
  </tr>
);

class Publication extends Component {
  constructor(props) {
    super(props);

    const { xml } = props;
    const xmls = Array.isArray(xml) ? xml : [xml];

    this.state = {
      arethusaLoaded: false,
      subDoc: '',
    };

    this.setSubdoc = this.setSubdoc.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    window.document.body.addEventListener('ArethusaLoaded', this.setSubdoc);
  }

  componentDidUpdate(prevProps) {
    const { arethusaLoaded } = this.state;
    const { location } = this.props;
    const { location: prevLocation } = prevProps;

    if (arethusaLoaded && location !== prevLocation) {
      this.setSubdoc();
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    window.document.body.removeEventListener('ArethusaLoaded', this.setSubdoc);
  }

  setSubdoc() {
  }

  render() {
    const {
      logo,
      link,
      publicationPath,
      author,
      work,
      editors,
      locus,
      publicationLink,
      notes,
      xml,
      chunks,
      match,
      location,
    } = this.props;

    const { subDoc } = this.state;
    const xmls = Array.isArray(xml) ? xml : [xml];

    return (
      <>
        <Header logo={logo} link={link}>
          <span>
            <i>{work}</i>
          </span>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href={`${process.env.PUBLIC_URL}/`}>
                Home
              </a>
            </li>
          </ul>
        </Header>
        <div className="container pt-3">
          <h2>
            <span>
              {author}
              ,
              <i>
                {' '}
                {work}
                {' '}
              </i>
              {locus}
            </span>
          </h2>
          <table className="table">
            <tbody>
              {!!author && renderRow('Author', author)}
              {!!work && renderRow('Work', work)}
              {!!locus && renderLocusRow('Locus', locus, publicationPath)}
              {!!subDoc && renderRow('Reference', subDoc)}
              {!!editors && renderRow('Editors', editors)}
              {!!publicationLink && renderLinkRow('Link', publicationLink)}
              {!!notes && renderMarkdownRow('Notes', notes)}
            </tbody>
          </table>
          <div className="row">
            {
              xmls.map((treebankXml, index) => (
                <div key={treebankXml} className="col">
                  <div className={styles.treebankWrapper}>
                    <Treebank
                      xml={treebankXml}
                      chunks={chunks}
                      location={location}
                      match={match}
                      elementId={`treebank_container_${index}`}
                      treebankReact={true}
                      setSubdoc={() => {}}
                    />
                  </div>
                </div>
              ))
            }
          </div>
          <div className="pt-1 pb-4 text-right">
            <a href={`${process.env.PUBLIC_URL}/xml/${xml}`} target="_blank" rel="noopener noreferrer">
              View XML
            </a>
          </div>
        </div>
      </>
    );
  }
}

Publication.propTypes = {
  logo: PropTypes.string,
  link: PropTypes.string,
  publicationPath: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  work: PropTypes.string.isRequired,
  editors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  locus: PropTypes.string.isRequired,
  publicationLink: PropTypes.string,
  notes: PropTypes.string,
  xml: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  chunks: chunksType.isRequired,
  match: publicationMatchType.isRequired,
  location: locationType.isRequired,
};

Publication.defaultProps = {
  logo: undefined,
  link: undefined,
  publicationLink: undefined,
  notes: undefined,
};

export default Publication;
