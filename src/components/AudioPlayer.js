import React from 'react'
import ReactHowler from 'react-howler'
import raf from 'raf'
import { ImVolumeMedium } from 'react-icons/im'
import { FaPlay, FaStop } from 'react-icons/fa'
import Switch from './Switch'
import Loading from './Loading'
import TimeItem from './TimeItem'

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playing: false,
            loaded: false,
            loop: false,
            mute: false,
            volume: 1.0,
            seek: 0.0,
            rate: 1,
            isSeeking: false,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
        this.handleToggle = this.handleToggle.bind(this)
        this.handleOnLoad = this.handleOnLoad.bind(this)
        this.handleOnEnd = this.handleOnEnd.bind(this)
        this.handleOnPlay = this.handleOnPlay.bind(this)
        this.handleStop = this.handleStop.bind(this)
        this.renderSeekPos = this.renderSeekPos.bind(this)
        this.handleLoopToggle = this.handleLoopToggle.bind(this)
        this.handleMuteToggle = this.handleMuteToggle.bind(this)
        this.handleMouseDownSeek = this.handleMouseDownSeek.bind(this)
        this.handleMouseUpSeek = this.handleMouseUpSeek.bind(this)
        this.handleSeekingChange = this.handleSeekingChange.bind(this)
        this.handleRate = this.handleRate.bind(this)
    }

    componentWillUnmount() {
        this.clearRAF()
    }

    handleToggle() {
        this.setState({
            playing: !this.state.playing
        })
    }

    handleOnLoad() {
        this.setState({
            loaded: true,
            duration: this.player.duration()
        })
    }

    handleOnPlay() {
        this.setState({
            playing: true
        })
        this.renderSeekPos()
    }

    handleOnEnd() {
        this.setState({
            playing: false
        })
        this.clearRAF()
    }

    handleStop() {
        this.player.stop()
        this.setState({
            playing: false // Need to update our local state so we don't immediately invoke autoplay
        })
        this.renderSeekPos()
    }

    handleLoopToggle() {
        this.setState({
            loop: !this.state.loop
        })
    }

    handleMuteToggle() {
        this.setState({
            mute: !this.state.mute
        })
    }

    handleMouseDownSeek() {
        this.setState({
            isSeeking: true
        })
    }

    handleMouseUpSeek(e) {
        this.setState({
            isSeeking: false
        })

        this.player.seek(e.target.value)
    }

    handleSeekingChange(e) {
        this.setState({
            seek: parseFloat(e.target.value)
        })
    }

    renderSeekPos() {
        if (!this.state.isSeeking) {
            this.setState({
                seek: this.player.seek()
            })
        }
        if (this.state.playing) {
            this._raf = raf(this.renderSeekPos)
        }
    }

    handleRate(e) {
        const rate = parseFloat(e.target.value)
        this.player.rate(rate)
        this.setState({ rate })
    }

    clearRAF() {
        raf.cancel(this._raf)
    }

    render() {
        return (
            <div className='max-w-[600px]'>
                <ReactHowler
                    src={this.props.src}
                    playing={this.state.playing}
                    onLoad={this.handleOnLoad}
                    onPlay={this.handleOnPlay}
                    onEnd={this.handleOnEnd}
                    loop={this.state.loop}
                    mute={this.state.mute}
                    volume={this.state.volume}
                    ref={(ref) => (this.player = ref)}
                />
                <div className="bg-[#101010] text-sky-400 font-mono rounded-lg flex flex-col gap-4 p-4">
                    <div className="flex justify-around">
                        <Loading loaded={this.state.loaded} title={this.props.title} />
                        <div>
                            <TimeItem
                                time={this.state.seek.toFixed(2)}
                            />
                            {' / '}
                            <TimeItem
                                time={(this.state.duration) ? this.state.duration.toFixed(2) : 'NaN'}
                            />
                        </div>
                    </div>
                    <div>
                        <input
                            className="w-full"
                            type='range'
                            min='0'
                            max={this.state.duration ? this.state.duration.toFixed(2) : 0}
                            step='.01'
                            value={this.state.seek}
                            onChange={this.handleSeekingChange}
                            onMouseDown={this.handleMouseDownSeek}
                            onMouseUp={this.handleMouseUpSeek}
                        />
                    </div>
                    <div className="flex text-2xl">
                        <div className="mx-auto flex gap-4">
                            <button
                                onClick={this.handleStop}
                            >
                                <FaStop className={`${this.state.playing ? 'opacity-50' : ''}`} />
                            </button>
                            <button
                                onClick={this.handleToggle}
                            >
                                <FaPlay className={`${this.state.playing ? '' : 'opacity-50'}`} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 md:col-span-4 flex gap-1 [&>*]:my-auto text-2xl [&>*]:mb-6 md:[&>*]:mb-0">
                            <ImVolumeMedium />
                            <input
                                className="w-full"
                                type='range'
                                min='0'
                                max='1'
                                step='.05'
                                value={this.state.volume}
                                onChange={e => this.setState({ volume: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-6 md:col-span-4 flex [&>*]:mx-auto">
                            <Switch
                                checked={this.state.loop}
                                onChange={this.handleLoopToggle}
                                label="Loop"
                            />
                        </div>
                        <div className="col-span-6 md:col-span-4 flex [&>*]:mx-auto">
                            <Switch
                                checked={this.state.mute}
                                onChange={this.handleMuteToggle}
                                label="Mute"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AudioPlayer