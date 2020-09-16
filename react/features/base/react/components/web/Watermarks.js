/* @flow */

import React, { Component } from 'react';

import { translate } from '../../../i18n';
import { connect } from '../../../redux';


declare var interfaceConfig: Object;

/**
 * The CSS style of the element with CSS class {@code rightwatermark}.
 *
 * @private
 */
const _RIGHT_WATERMARK_STYLE = {
    backgroundImage: 'url(images/rightwatermark.png)'
};

/**
 * The type of the React {@code Component} props of {@link Watermarks}.
 */
type Props = {

    /**
     * The user selected url used to navigate to on logo click.
     */
    _customLogoLink: string,

    /**
     * The url of the user selected logo.
     */
    _customLogoUrl: string,

    /**
     * If the logo(JitsiWatermark) should use dynamic data (custom logo & url).
     */
    _useDynamicBrandingData: boolean,

    /**
     * If the Jitsi watermark should be displayed or not.
     */
    _showJitsiWaterMark: boolean,

    /**
     * The default value for the Jitsi logo URL.
     */
    defaultJitsiLogoURL: ?string,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * The type of the React {@code Component} state of {@link Watermarks}.
 */
type State = {

    /**
     * The url to open when clicking the brand watermark.
     */
    brandWatermarkLink: string,

    /**
     * Whether or not the brand watermark should be displayed.
     */
    showBrandWatermark: boolean,

    /**
     * Whether or not the show the "powered by Jitsi.org" link.
     */
    showPoweredBy: boolean
};

/**
 * A Web Component which renders watermarks such as Jits, brand, powered by,
 * etc.
 */
class Watermarks extends Component<Props, State> {
    /**
     * Initializes a new Watermarks instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        let showBrandWatermark;

        if (interfaceConfig.filmStripOnly) {
            showBrandWatermark = false;
        } else {
            showBrandWatermark = interfaceConfig.SHOW_BRAND_WATERMARK;
        }

        this.state = {
            brandWatermarkLink:
                showBrandWatermark ? interfaceConfig.BRAND_WATERMARK_LINK : '',
            showBrandWatermark,
            showPoweredBy: interfaceConfig.SHOW_POWERED_BY
        };
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div>
                {
                    this._renderJitsiWatermark()
                }
                {
                    this._renderBrandWatermark()
                }
                {
                    this._renderPoweredBy()
                }
            </div>
        );
    }

    /**
     * Renders a brand watermark if it is enabled.
     *
     * @private
     * @returns {ReactElement|null} Watermark element or null.
     */
    _renderBrandWatermark() {
        let reactElement = null;

        if (this.state.showBrandWatermark) {
            reactElement = (
                <div
                    className = 'watermark rightwatermark'
                    style = { _RIGHT_WATERMARK_STYLE } />
            );

            const { brandWatermarkLink } = this.state;

            if (brandWatermarkLink) {
                reactElement = (
                    <a
                        href = { brandWatermarkLink }
                        target = '_new'>
                        { reactElement }
                    </a>
                );
            }
        }

        return reactElement;
    }

    /**
     * Renders a Jitsi watermark if it is enabled.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderJitsiWatermark() {
        const {
            _customLogoLink,
            _customLogoUrl,
            _useDynamicBrandingData,
            _showJitsiWaterMark,
            defaultJitsiLogoURL
        } = this.props;
        let reactElement = null;

        if (_showJitsiWaterMark) {
            let link;
            let backgroundImage;

            if (_useDynamicBrandingData) {
                link = _customLogoLink;
                backgroundImage = `url(${_customLogoUrl})`;
            } else {
                link = interfaceConfig.JITSI_WATERMARK_LINK;
                backgroundImage = `url(${defaultJitsiLogoURL
                                || interfaceConfig.DEFAULT_LOGO_URL})`;
            }

            const style = {
                backgroundImage,
                maxWidth: 140,
                maxHeight: 70
            };

            reactElement = (<div
                className = 'watermark leftwatermark'
                style = { style } />);

            if (link) {
                reactElement = (
                    <a
                        href = { link }
                        target = '_new'>
                        { reactElement }
                    </a>
                );
            }
        }

        return reactElement;
    }

    /**
     * Renders a powered by block if it is enabled.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderPoweredBy() {
        if (this.state.showPoweredBy) {
            const { t } = this.props;

            return (
                <a
                    className = 'poweredby'
                    href = 'http://jitsi.org'
                    target = '_new'>
                    <span>{ t('poweredby') } jitsi.org</span>
                </a>
            );
        }

        return null;
    }
}

/**
 * Maps parts of Redux store to component prop types.
 *
 * @param {Object} state - Snapshot of Redux store.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const { isGuest } = state['features/base/jwt'];
    const {
        customizationReady,
        customizationFailed,
        useDynamicBrandingData,
        logoClickUrl,
        logoImageUrl
    } = state['features/dynamic-branding'];
    const welcomePageVisible = !state['features/base/conference'].room;
    const { SHOW_JITSI_WATERMARK, SHOW_JITSI_WATERMARK_FOR_GUESTS, filmStripOnly } = interfaceConfig;
    const showJitsiWatermark = (!filmStripOnly
          && (customizationReady && !customizationFailed)
          && (SHOW_JITSI_WATERMARK || (isGuest && SHOW_JITSI_WATERMARK_FOR_GUESTS)))
    || welcomePageVisible;

    return {
        _customLogoLink: logoClickUrl,
        _customLogoUrl: logoImageUrl,
        _useDynamicBrandingData: useDynamicBrandingData,
        _showJitsiWaterMark: showJitsiWatermark
    };
}

export default connect(_mapStateToProps)(translate(Watermarks));
