React is a popular front-end framework used by developers around the world to build web applications. One of the key advantages of React is its ability to create reusable components that can be easily shared across different parts of a project or even between projects. However, building custom React components can be a challenging task, especially if you're not familiar with the tools and libraries that are available.

In this tutorial, we will explore how to create a custom React component that combines the power of Tailwind CSS for styling and Howler for audio playback. Tailwind CSS is a popular utility-first CSS framework that allows developers to easily style their components using pre-defined classes, while Howler is a fast and lightweight JavaScript library for audio playback.

We'll start by setting up a new React project and installing the necessary dependencies. We'll then create a new custom component that will render an audio player interface, allowing the user to play, pause, and stop an audio file. We'll use Tailwind CSS to style the interface, and Howler to handle the audio playback functionality.

## The AudioPlayer Component

If you're relatively new to React, then you've probably only dealt with functional components. FCs are great for small-sized components, but for larger, more complex interfaces, you'll want to use a full-fledged React.Component class. In this example, I use FCs for the smaller bits and a class for the player itself.

```jsx
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
```

This component implements an audio player using the ReactHowler library. The audio player allows users to play and stop audio tracks, adjust the volume, seek through the track, and change the playback rate.

It also uses `raf` (short for "requestAnimationFrame") to schedule and synchronize animations and updates with the browser's rendering engine. This technique is commonly used for performance optimization and smoother animation, as it allows the browser to schedule the update for the next frame, usually at 60 frames per second, and avoids overloading the browser with too many updates in a short period of time. In this specific code, `raf` is used to repeatedly call `this.renderSeekPos()` when the player is playing, which updates the seek position on the seek bar. This creates a smooth animation effect and prevents the update from happening too frequently or too infrequently.

We use several state variables to keep track of the player's current state, such as whether the audio is playing or not, whether the audio is muted, the current volume level, and the current seek position.

Also, several event handlers are there to handle user interaction with the audio player, such as when the user toggles play or stop, mutes or unmutes the audio, adjusts the volume or seek position, and changes the playback rate.

The component also uses some custom components, such as `Loading` to show a loading spinner when the audio is loading, `Switch` to toggle the loop mode, and `TimeItem` to display the current time and duration of the audio track. Please visit the repository (link at bottom) for the code for those items.

---

## Links

1. [GitHub Repo](https://github.com/designly1/next-audio-player-example)
2. [Demo Page](https://next-audio-player-example.pages.dev/)

---

Thank you for taking the time to read my article and I hope you found it useful (or at the very least, mildly entertaining). For more great information about web dev, systems administration and cloud computing, please read the [Designly Blog](https://designly.biz/blog). Also, please leave your comments! I love to hear thoughts from my readers.

I use [Hostinger](https://hostinger.com?REFERRALCODE=1J11864) to host my clients' websites. You can get a business account that can host 100 websites at a price of $3.99/mo, which you can lock in for up to 48 months! It's the best deal in town. Services include PHP hosting (with extensions), MySQL, Wordpress and Email services.

Looking for a web developer? I'm available for hire! To inquire, please fill out a [contact form](https://designly.biz/contact).