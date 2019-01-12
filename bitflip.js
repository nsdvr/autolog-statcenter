const fs = require('fs')

class Bit {
    constructor() {
        this.high = false
        this.userid = null
    }
}

class Sequence {
    constructor(bits, activeBit, score, flips) {
        this.bits = bits
        this.activeBit = activeBit
        this.score = score
        this.flips = flips
        this.needsInvite = false
    }
}

let sequence = null
class BitFlip {
    static init () {
        try {
            var seq = fs.readFileSync('./sequence.json')
            sequence = Object.assign(new Sequence, JSON.parse(seq))
        } catch (error) {
            console.log(error)
            sequence = new Sequence([], 0, 0, 0)
        }
    }

    static save() {
        fs.writeFileSync('./sequence.json', JSON.stringify(sequence))
    }

    static calc (seq) {
        let binString = ''
        seq.bits.forEach(bit => {
            binString = (bit.high ? '1' : '0') + binString
        })
        seq.score = parseInt(binString, 2)
    }

    static status() {
        let seq = sequence
        this.calc(seq)

        let wrap = `\`\`\``

        let binString = ''
        let activeString = ''
        let i = 0
        if(seq.bits.length) {
            seq.bits.forEach(bit => {
                binString = (bit.high ? '1' : '0') + binString
                activeString = (i == seq.activeBit ? '^' : '.') + activeString
                i++
            })
        }

        // console.log(binString)
        // console.log(activeString)

        // let inner =
        // `${binString}
        // ${activeString}`
        // console.log('fmt:\n'+inner)
        let response =
`${wrap}
${binString}
${activeString}
${wrap}
Score: ${seq.score}`

        if(seq.bits.length) {
            if(seq.needsInvite) {
                response += `\nIt's ${seq.bits[seq.activeBit].userid}'s turn to invite a new player.`
            }
            else {
                response += `\nIt's ${seq.bits[seq.activeBit].userid}'s turn.`
            }
        }
        return response
    }

    static gameContainsUser(seq, user) {
        return seq.bits.map(bit => bit.userid).includes(user)
    }

    static flip(user, mention) {
        let seq = sequence

        // console.log('--- FLIPPING ---')
        // console.log(seq)

        if(!seq.bits.length) {
            // console.log('no bits, creating first bit...')
            let bit = new Bit()
            bit.userid = user
            seq.bits.push(bit)
            this.save()
            return `Time for a new game!`
        }
        if(seq.activeBit >= seq.bits.length) {
            // console.log('game is broke')
            return 'This game is broke. :('
        }

        let currentBit = seq.bits[seq.activeBit]

        if(!this.gameContainsUser(seq, user)) {
            return `Sorry, you're not even part of the game, ${user}. Pester someone to invite you.`
        }

        if(currentBit.userid !== user) {
            // console.log(`curr user '${currentBit.user}'`)
            // console.log(`flip user '${currentBit.user}'`)
            return `It's definitely not your turn, ${user}`
        }

        if(mention && !seq.needsInvite) {
            return  `This is not the right time to invite someone, ${currentBit.userid}`
        }

        let newstate = !currentBit.high
        // console.log(`attempting to flip active bit to ${newstate}`)

        if(seq.needsInvite) {
            // console.log(`we need a new bit`)
                if(mention) {
                    // console.log(`we have a mention`)
                    if(!this.gameContainsUser(seq, mention)) {
                        let newBit = new Bit({})
                        newBit.high = true
                        seq.bits.push(newBit)
                        for(let i = 0; i < seq.bits.length-1; i++) {
                            let lo = seq.bits[i]
                            let hi = seq.bits[i+1]
                            hi.userid = lo.userid
                        }
                        seq.bits[0].userid = mention
                        currentBit.high = newstate
                        seq.needsInvite = false
                        this.save()
                        return `Congs. Successfully invited ${mention}`
                    }
                    else {

                        if(mention == currentBit.userid) {
                            return `You fucking idiot. Why would you try and invite yourself?`
                        }

                        return `Ugh. You cannot invite ${mention} because they are already in the game.`
                    }
                }
                else {
                    // console.log('new user must be invited but we have no mention')
                    return `A new player is needed. Type "!flip @username" to invite.`
                }
        }
        else {
            if(!newstate) {
                // console.log(`we're in the low block`)
                // console.log(`activeBit: ${seq.activeBit} length: ${seq.bits.length}`)
                if(seq.activeBit == seq.bits.length - 1) {
                    seq.needsInvite = true
                    seq.activeBit = 0
                    this.save()
                    return 'Time to expand the bit sequence.'
                }
                else {
                    seq.activeBit++
                    currentBit.high = newstate
                    this.save()
                    // console.log(`incrementing active bit to ${seq.activeBit}`)
                    return
                }
            } else {
                seq.activeBit = 0
                currentBit.high = newstate
            }
            seq.flips++
            this.calc(seq)
            this.save()
        }
    }
}

module.exports = {
    BitFlip: BitFlip,
    // Sequence: Sequence,
    // Bit: Bit
}